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
                modelName: false,
                uniqueAttributes: [],
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

        isUnique: function(data, attributes) {
            var attributes = attributes || this.uniqueAttributes,
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
    });
});