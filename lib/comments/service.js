'use strict';

module.exports = app => ({
  async create(attributes, options = {}) {
    const comment = await app.locals.models.Comment.forge(attributes).save(
      null,
      {
        ...options,
        method: 'insert',
        require: true,
      },
    );
    return comment;
  },

  async fetch(attributes, options = {}) {
    const comment = await app.locals.models.Comment.forge(attributes).fetch({
      ...options,
      require: true,
    });
    return comment;
  },

  async del(comment, options = {}) {
    const deletedComment = await comment.destroy({...options, require: true});
    return deletedComment;
  },

  async toJSON(comment, user) {
    await comment.load('author');
    return {
      author: await app.locals.services.users.getProfileJSON(
        comment.related('author'),
        user,
      ),
      body: comment.get('body'),
      createdAt: comment.get('created_at'),
      id: comment.id,
      updatedAt: comment.get('updated_at'),
    };
  },
});
