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

            this.on('change', this.onChange);
        },

        onChange: function() {
            this.collection.sort();
            this.collection.trigger('update');
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

        getDisplayName: function() {
            return _.isFunction(this.displayName) ? this.displayName() : this.get(this.displayName);
        },

        find: function(modelName, options) {
            options = $.extend(true, {
                selfAttribute: modelName + '_id',
            }, options);
            var id = this.get(options.selfAttribute);
            return !_.isNull(id) ? app.collections.get(modelName).get(id) : null;
        },

        findAll: function(modelName, options) {
            options = $.extend(true, {
                selfAttribute: 'id',
                refAttribute: this.collection.modelName + '_id',
                where: {},
            }, options);
            var where = options.where;
            where[options.refAttribute] = this.get(options.selfAttribute);
            return app.collections.get(modelName).where(where);
        },

        parseDate: function(attribute, format) {
            format = format || 'yy-mm-dd';
            var value = this.get(attribute);
            return !_.isNull(value) ? Date.parse(value, format) : null;
        },

        formatDate: function(attribute, format) {
            format = format || 'yy-mm-dd';
            var date = this.parseDate(attribute);
            return !_.isNull(date) ? date.format(format) : '';
        },

        toFixed: function(attribute, digits) {
            digits = digits || 0;
            return parseFloat(this.get(attribute)).toFixed(digits);
        },
    });
});