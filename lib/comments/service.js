'use strict';

module.exports = ({locals: {models: {Comment}}}) => ({
  async create(attributes, options = {}) {
    const comment = await Comment.forge(attributes).save(null, {
      ...options,
      method: 'insert',
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
      author: comment.related('author').toProfileJSONFor(user),
      body: comment.get('body'),
      createdAt: comment.get('created_at'),
      id: comment.id,
      updatedAt: comment.get('updated_at'),
    };
  },
});
