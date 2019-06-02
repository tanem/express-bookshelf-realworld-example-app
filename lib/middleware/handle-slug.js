'use strict'

const errorCatcher = require('async-error-catcher').default

module.exports = errorCatcher(async (req, res, next) => {
  const {
    app: {
      locals: {
        services: { articles }
      }
    },
    params: { slug } = {}
  } = req
  const {
    locals: { trx }
  } = res

  const article = await articles.fetch({ slug }, { trx })
  res.locals.article = article

  next()
})
