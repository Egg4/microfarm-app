'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.View.extend({

        initialize: function (options) {
            Backbone.View.prototype.initialize.call(this);

            this.items = options || {};
        },

        has: function (key) {
            return (key in this.items);
        },

        get: function (key) {
            if (!this.has(key)) {
                throw new Error('Item "' + key + '" not found');
            }
            if (_.isFunction(this.items[key])) {
                this.items[key] = this.items[key]();
            }
            return this.items[key];
        },

        set: function (key, value) {
            this.items[key] = value;
        },

        each: function (iteratee) {
            return _.each(this.items, function(item, key) {
                iteratee(this.get(key), key);
            }.bind(this));
        },

        map: function (iteratee) {
            return _.map(this.items, function(item, key) {
                return iteratee(this.get(key), key);
            }.bind(this));
        },
    });
});