'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.View.extend({

        initialize: function (options) {
            Backbone.View.prototype.initialize.call(this);

            var defaults = {
                dependencies: [],
                schemas: {},
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));
        },
    });
});