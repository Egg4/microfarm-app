'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            $(this.el).addClass('layout-widget');
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).empty();
        },
    });
});