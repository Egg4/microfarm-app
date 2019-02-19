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
            return _.has(this.items, key);
        },

        isFunction: function (key) {
            if (!this.has(key)) {
                throw new Error('Item "' + key + '" not found');
            }
            return _.isFunction(this.items[key]);
        },

        get: function (key) {
            if (!this.has(key)) {
                throw new Error('Item "' + key + '" not found');
            }
            if (this.isFunction(key)) {
                this.items[key] = this.items[key]();
            }
            return this.items[key];
        },

        set: function (key, value) {
            this.items[key] = value;
        },

        unset: function (key) {
            delete this.items[key];
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