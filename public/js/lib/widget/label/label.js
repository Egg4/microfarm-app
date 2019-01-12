'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'span',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                text: false,
                icon: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('label-widget');
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).empty();
            var icon = _.isFunction(this.icon) ? this.icon() : this.icon;
            if (icon) {
                $(this.el).append(icon.el);
                icon.render();
            }
            var text = _.isFunction(this.text) ? this.text() : this.text;
            if (text) {
                $(this.el).append('<span class="text">' + text + '</span>');
            }
        },
    });
});