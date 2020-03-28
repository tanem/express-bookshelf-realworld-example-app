'use strict';

module.exports = (app) => ({
  async create(attributes, {trx} = {}) {
    const comment = await app.locals.models.Comment.forge(attributes).save(
      null,
      {
        method: 'insert',
        require: true,
        transacting: trx,
      },
    );
    return comment;
  },

  async fetch(attributes, {trx} = {}) {
    const comment = await app.locals.models.Comment.forge(attributes).fetch({
      require: true,
      transacting: trx,
    });
    return comment;
  },

  async del(comment, {trx} = {}) {
    const deletedComment = await comment.destroy({
      require: true,
      transacting: trx,
    });
    return deletedComment;
  },

  async toJSON(comment, user, {trx} = {}) {
    await comment.load('author', {transacting: trx});
    return {
      author: await app.locals.services.users.getProfileJSON(
        comment.related('author'),
        user,
        {trx},
      ),
      body: comment.get('body'),
      createdAt: comment.get('created_at'),
      id: comment.id,
      updatedAt: comment.get('updated_at'),
    };
  },
});
