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
            if (this.icon) {
                var icon = _.isFunction(this.icon) ? this.icon() : this.icon;
                $(this.el).append(icon.el);
                icon.render();
            }
            if (this.text) {
                var text = _.isFunction(this.text) ? this.text() : this.text;
                $(this.el).append('<span class="text"> ' + text + '</span>');
            }
        },
    });
});