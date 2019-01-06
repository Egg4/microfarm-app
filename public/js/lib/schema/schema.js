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
                model: false,
                collection: false,
                form: false,
                dialog: false,
                menu: false,
                page: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));
        },
    });
});