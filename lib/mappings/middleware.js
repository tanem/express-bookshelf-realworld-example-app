'use strict';

const Boom = require('@hapi/boom');
const errorCatcher = require('async-error-catcher').default;

exports.isMappingAuthor = errorCatcher(async (req, res, next) => {
    const {user} = req;
    const {locals: {mapping} = {}} = res;

    if (mapping.get('author') !== user.id) {
        throw Boom.forbidden();
    }

    next();
});