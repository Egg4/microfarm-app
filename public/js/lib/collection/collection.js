'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.Collection.extend({

        initialize: function (models, options) {
            Backbone.Collection.prototype.initialize.call(this, models, options);

            var defaults = {
                collections: false,
                modelName: false,
                foreignKeys: {},
                uniqueKey: [],
                url: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));
        },

        get: function(id) {
            return Backbone.Collection.prototype.get.call(this, id) || null;
        },

        create: function(attributes, options) {
            Backbone.Collection.prototype.create.call(this, attributes, $.extend(true, {
                wait: true,
            }, options));
        },

        sortBy: function(attribute) {
            if (_.isString(attribute)) {
                return _.sortBy(this.models, function(model) {
                    var value = model.get(attribute);
                    if (_.isString(value)) {
                        return value.removeDiacritics().toLowerCase();
                    }
                    return value;
                });
            }
            return Backbone.Collection.prototype.sortBy.call(this, attribute);
        },

        filter: function(attributes) {
            return _.filter(this.models, function (model) {
                return model.isMatch(attributes);
            });
        },

        find: function(attributes) {
            return _.find(this.models, function (model) {
                return model.isMatch(attributes);
            });
        },

        isUnique: function(data, attributes) {
            var attributes = attributes || this.uniqueKey,
                where = {},
                isUnique = true;
            _.each(attributes, function(attribute) {
                where[attribute] = data[attribute];
            });
            _.each(this.where(where), function(model) {
                if (model.get('id') != data.id) {
                    isUnique = false;
                }
            });
            return isUnique;
        },

        handleForeignKeys: function(foreignModel) {
            _.each(this.foreignKeys, function(foreignKey, attribute) {
                if (foreignKey.model === foreignModel.collection.modelName) {
                    this.handleForeignKey(attribute, foreignModel.get('id'), foreignKey.onDelete);
                }
            }.bind(this));
        },

        handleForeignKey: function(attribute, value, onDelete) {
            var filter = {};
            filter[attribute] = value;
            var models = this.where(filter);

            if (_.isEmpty(models)) return;
            switch (onDelete) {
                case 'cascade':
                    this.remove(models, {silent: true});
                    _.each(models, function(model) {
                        this.trigger('remove', model, this, {});
                    }.bind(this));
                    break;
                case 'set_null':
                    _.each(models, function(model) {
                        model.set(attribute, null, {silent: true});
                    });
                    break;
            }
            this.trigger('update', this, {});
        },
    });
});