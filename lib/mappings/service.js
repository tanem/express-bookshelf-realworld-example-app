'use strict';

const {orderBy} = require('lodash/fp');

module.exports = (app) => ({
    async create({tagList, ...restAttributes} = {}, {trx} = {}) {
        const mapping = await app.locals.models.Mapping.forge(restAttributes).save(
            null,
            {
                method: 'insert',
                require: true,
                transacting: trx,
            },
        );

        await app.locals.services.mappings.tagMapping(mapping, tagList, {trx});

        return mapping;
    },

    async fetch(attributes, {trx} = {}) {
        const mapping = await app.locals.models.Mapping.forge(attributes).fetch({
            require: true,
            transacting: trx,
        });

        return mapping;
    },

    async update(mapping, attributes, {trx} = {}) {
        const updatedMapping = await mapping.save(attributes, {
            method: 'update',
            patch: true,
            require: true,
            transacting: trx,
        });

        return updatedMapping;
    },

    async del(mapping, {trx} = {}) {
        const deletedMapping = await mapping.destroy({
            require: true,
            transacting: trx,
        });

        return deletedMapping;
    },

    async toJSON(mapping, user, {trx} = {}) {
        await mapping.load(['author','favoritedBy','tags'], {transacting: trx});
        return {
            author: await app.locals.services.users.getProfileJSON(
                mapping.related('author'),
                user,
                {trx},
            ),
            version         : mapping.get('version'),
            keyword         : mapping.get('keyword'),
            child_of        : mapping.get('child_of'),
            parent_of       : mapping.get('parent_of'),
            mapper_code     : mapping.get('mapper_code'),
            createdAt       : mapping.get('created_at'),
            favorited       : user 
                            ? mapping.related('favoritedBy').pluck('id').includes(user.id)
                            : false,
            favoritesCount  : mapping.related('favoritedBy').length,
            slug            : mapping.get('slug'),
            tagList         : mapping.related('tags')
                            .orderBy('_pivot_created_at').pluck('name'),
            updatedAt       : mapping.get('updated_at'),
        };
    },

    async getCommentsJSON(mapping, user, {trx} = {}) {
        await mapping.load('comments');
        const commentsJSON = await Promise.all(
            mapping.related('comments').map(async(comment) => {
                const commentJSON = await app.locals.services.comments.toJSON(
                    comment,
                    user,
                    {trx},
                );
                return commentJSON;
            }),
        );
        return orderBy('createdAt', 'desc', commentsJSON);
    },

    async getMappingsJSON(
        {author, favorited, limit = 20, offset = 0, tag} = {},
        user,
        {trx} = {},
    ) {

        const {
            models: mappings,
            pagination,
        } = await app.locals.models.Mapping
        .forge()
        .query(qb => {
            if (author) {
                qb.andWhereRaw(`
                author = (
                    SELECT id
                    FROM users
                    WHERE username = ?
                )
                `,[author]);
            }

            if (favorited) {
                qb.andWhereRaw(`
                id IN (
                    SELECT mapping 
                    FROM favorites
                    WHERE favorites.user = (
                        SELECT id 
                        FROM users
                        WHERE username = ?
                    )
                )
                `, [favorited]);
            }

            if (tag) {
                qb.andWhereRaw(`
                id IN (
                    SELECT mapping
                    FROM mappings_tags
                    WHERE tag = (
                        SELECT id 
                        FROM tags
                        WHERE name = ?
                    )
                )
                `, [tag]);
            }
        })
        .orderBy('created_at', 'DESC')
        .fetchPage({
            limit,
            offset,
            transacting: trx,
        });

        const mappingsJSON = {
            mappings: await Promise.all(
                mappings.map(async (mapping) => {
                    const mappingJSON = await app.locals.services.mappings.toJSON(
                        mapping,
                        user,
                        {trx},
                    );
                    return mappingsJSON;
                }),
            ),
            mappingsCount: pagination.rowCount,
        };

        return mappingsJSON;
    },

    async getFeedJSON({limit = 20, offset = 0} = {}, user, {trx} = {}) {

        const {
            models: mappings,
            pagination,
        } = await app.locals.models.Mapping
            .forge()
            .query(qb => {
                qb.andWhereRaw(`
                author in (
                    SELECT followers.user
                    FROM followers
                    WHERE followers.follower = ?
                )
                `, [user.id]);
            })
            .orderBy('created_at', 'DESC')
            .fetchPage({
                limit,
                offset,
                transacting: trx,
            });

        const feedJSON = {
            mappings : await Promise.all(
                mappings.map(async (mapping) => {
                    const mappingJSON = await app.locals.services.mappings.toJSON(
                        mapping,
                        user,
                        {trx},
                    );
                    return mappingJSON;
                }),
            ),
            mappingsCount: pagination.rowCount,
        };

        return feedJSON;
    },

    async tagMapping(mapping, tagList = [], {trx} = {}) {
        for (let tagName of tagList) {
            let tag;

            try {
                tag = await app.locals.services.tags.fetch({name: tagName}, {trx});
            } catch (e) {} // e is ?

            if (!tag) {
                tag = await app.locals.services.tags.create({name: tagName}, {trx});
            }

            await app.locals.services.mappingsTags.create(
                {
                    mapping: mapping.id,
                    tag: tag.id,
                },
                {trx},
            );
        }
    },
});