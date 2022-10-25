'use strict';

const Checkit = require('checkit');

module.exports = (bookshelf) => 
    bookshelf.model('MappingTag', {
        tableName: 'mappings_tags',

        getValidators() {
            return {
                mapping: [
                    'required',
                    'number',
                    this.unsafeValidateUnique(['mapping','tag'], 'is already tagged'),
                ],
                tag: ['required', 'number'],
            };
        },

        mapping() {
            return this.belongsTo('Mapping', 'mapping');
        },

        tag() {
            return this.belongsTo('Tag', 'tag');
        },

        initialize() {
            this.on('saving', this.handleSaving);
        },

        async handleSaving(model, attrs, options) {
            const checkit = new Checkit(this.getValidators(), {
                messages: {
                    required: `can't be blank`,
                },
            });

            await checkit.run(this.attributes, options);
        },
    });