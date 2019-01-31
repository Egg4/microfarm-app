'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.Model.extend({
        displayName: 'id',

        initialize: function (attributes, options) {
            Backbone.Model.prototype.initialize.call(this, attributes, options);

            $.extend(true, this, {
                collections: this.collection.collections,
            });

            this.on('change', this.onChange);
        },

        onChange: function(model, options) {
            if (!options.silent) {
                this.collection.sort();
                this.collection.trigger('update');
            }
        },

        save: function(attributes, options) {
            Backbone.Model.prototype.save.call(this, attributes, $.extend(true, {
                patch: true,
                wait: true,
            }, options));
        },

        destroy: function(options) {
            Backbone.Model.prototype.destroy.call(this, $.extend(true, {
                wait: true,
            }, options));
        },

        isMatch: function (attributes) {
            var keys = _.keys(attributes),
                length = keys.length;

            for (var i = 0; i < length; i++) {
                var key = keys[i],
                    values = _.isArray(attributes[key]) ? attributes[key] : [attributes[key]];
                if (_.isUndefined(this.attributes[key])
                    || !_.contains(values, this.attributes[key])) return false;
            }
            return true;
        },

        getDisplayName: function() {
            return _.isFunction(this.displayName) ? this.displayName() : this.get(this.displayName);
        },

        find: function(modelName, options) {
            options = $.extend(true, {
                selfAttribute: modelName + '_id',
            }, options);
            var id = this.get(options.selfAttribute);
            return !_.isNull(id) ? this.collections.get(modelName).get(id) : null;
        },

        findAll: function(modelName, where, options) {
            options = $.extend(true, {
                selfAttribute: 'id',
                refAttribute: this.collection.modelName + '_id',
            }, options);
            where = where || {};
            where[options.refAttribute] = this.get(options.selfAttribute);
            return this.collections.get(modelName).where(where);
        },
    });
});