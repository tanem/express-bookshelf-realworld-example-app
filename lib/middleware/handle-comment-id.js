'use strict'

const errorCatcher = require('async-error-catcher').default

module.exports = errorCatcher(async (req, res, next) => {
  const {
    app: { locals: { services: { comments } } = {} } = {},
    params: { commentId } = {}
  } = req
  const {
    locals: { trx }
  } = res

  const comment = await comments.fetch({ id: commentId }, { trx })
  res.locals.comment = comment

  next()
})
