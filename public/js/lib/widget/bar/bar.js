'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                layout: false,
                role: 'none',
                position: false,
                tapToggle: false,
                theme: 'a',
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('bar-widget');
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).attr('data-role', this.role);
            if (this.position) {
                $(this.el).attr('data-position', this.position);
            }
            else {
                $(this.el).removeAttr('data-position');
            }
            $(this.el).attr('data-tap-toggle', this.tapToggle);
            $(this.el).attr('data-theme', this.theme);

            var layout = _.isFunction(this.layout) ? this.layout() : this.layout;
            $(this.el).html(layout.el);
            layout.render();

            $(this.el).toolbar();
        },
    });
});