'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.create = errorCatcher(async(req, res) => {
    const {body : {mapping: payload} = {}, user} = req;
    const {
        app: {
            locals: {
                services: {mappings},
            },
        },
        locals: {trx},
    } = res;

    const mapping = await mappings.create({...payload, author: user.id}, {trx});

    res.status(201).json({
        mapping: await mappings.toJSON(mapping, user, {trx}),
    });
});

exports.del = errorCatcher(async(req, res) => {
    const {
        app: {
            locals: {
                services: {mappings},
            },
        },
        locals: {mapping, trx} = {}, //handleSlug fetches this mapping
    } = res;

    await mappings.del(mapping, {trx});

    res.sendStatus(200);
});

exports.feed = errorCatcher(async (req, res) => {
    const {query: {limit, offset} = {}, user} = req ;
    const {
        app: {
            locals: {
                services: {mappings},
            },
        },
    } = res;

    const feedJSON = await mappings.getFeedJSON(
        {
            limit,
            offset,
        },
        user,
    );

    res.json(feedJSON);
});

exports.index = errorCatcher(async (req, res) => {
    const {query: {author, favorited, limit, offset, tag} = {}, user} = req;
    const {
        app: {
            locals: {
                services: {mappings},
            },
        },
    } = res;

    const mappingsJSON = await mappings.getMappingsJSON(
        {
            author,
            favorited,
            limit,
            offset,
            tag,
        },
        user,
    );

    res.json(mappingsJSON);
});

exports.show = errorCatcher(async (req, res) => {
    const {user} = req;
    const {
        app: {
            locals: {
                services: {mappings},
            },
        },
        locals: {mapping} = {}
    } = res;

    res.json({mapping: await mappings.toJSON(mapping, user)});
});

exports.update = errorCatcher(async (req, res) => {
    const {body: {mapping: payload} = {}, user} = req;
    const {
        app: {
            locals: {
                services: {mappings},
            },
        },
        locals: {mapping, trx} = {},
    } = res;

    const updatedMapping = await mappings.update(mapping, payload, {trx});

    res.json({mapping: await mappings.toJSON(updatedMapping, user, {trx})});
});
