'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'div',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, $.extend(true, options, {
                css: {
                    display: 'none',
                },
            }));

            var defaults = {
                layout: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('loader-widget');
            $('body').append(this.el);
        },

        render: function () {
            Widget.prototype.render.call(this);

            var layout = _.isFunction(this.layout) ? this.layout() : this.layout;
            $(this.el).html(layout.el);
            layout.render();
        },

        show: function () {
            this.render();
            $(this.el).show(0);
        },

        hide: function () {
            $(this.el).hide(0);
        },
    });
});