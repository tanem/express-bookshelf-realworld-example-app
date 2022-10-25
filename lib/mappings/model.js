'use strict';

const Checkit = require('checkit') ; // ?
const slug = require('slug'); // ?
const {v4: uuidv4} = require('uuid'); // ?

module.exports = function Mapping(bookshelf) {
    return bookshelf.model('Mapping', {
        tableName: 'mappings',

        comments() { 
            //pk of "mappings" has 1-Many rels with "comments" mapping column
            return this.hasMany('Comment', 'mapping');//mapping is a column in "comments" table. 
        }, // Comment is model name for table "comments"


        author() {
            // author of "mappings" is fk for "users" table 
            return this.belongsTo('User', 'author'); 
        }, // User is model name for table "users"

        favoritedBy() {
            // "mappings"(id)--> "favorites"(mapping) : "favorites"(user)--> "users"(id)
            return this.belongsToMany('User').through('Favorite','mapping','user');
        }, // User & Favorite are model name for "users" & "favorites", respectively 

        tags() {
            //"mappings"(id)-->"mappings_tags"(mapping):"mappings_tags"(tag)-->"tags"(id)
            return this.belongsToMany('Tag').withPivot(['created_at'])
            .through('MappingTag', 'mapping','tag');
        }, // Tag & MappingTag are model name for "tags" & "mappings_tags", respectively 

        getValidators() {
            return {
                author      : ['required', 'number'],
                version     : ['required', 'string'],
                keyword     : ['required', 'string'],
                child_of    : ['required', 'string'],
                parent_of   : ['required', 'string'],
                mapper_code : ['required', 'string'],
                slug        : ['required', 'string', this.unsafeValidateUnique(['slug'])],
            };
        },

        initialize() {
            this.on('saving', this.handleSaving); // ?
        },

        async handleSaving(model, attrs, options) {
            if (!this.has('slug')) {
                this.set('slug', this.getSlug());
            }

            const checkit = new Checkit(this.getValidators(), {
                messages: {
                    required: `can't be blank`, // blank column shouldn't be inserted
                },
            });

            await checkit.run(this.attributes, options);
        },

        getSlug() { //?
            return slug(`${this.get('title')}-${uuidv4().substr(0,6)}`,{
                lower: true,
            });
        },
    });
};
