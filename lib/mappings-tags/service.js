'use strict';

module.exports = (app) => ({
    async create(attributes, {trx} = {}) {
        const mappingTag = await app.locals.models.MappingTag.forge(
            attributes,
        ).save(null, {
            method: 'insert',
            require: true,
            transacting: trx,
        });
        return mappingTag;
    },
});