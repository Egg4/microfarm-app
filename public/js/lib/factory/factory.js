'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.View.extend({}, {

        create: function(name, options) {
            if (_.isFunction(this[name])) {
                return this[name](options);
            }
            throw new Error('Function "' + name + '" not found');
        },
    });
});