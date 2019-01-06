'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'li',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                content: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('list-item-widget');
        },

        render: function () {
            Widget.prototype.render.call(this);

            var content = _.isFunction(this.content) ? this.content() : this.content;
            $(this.el).append(content.el);
            content.render();
        },
    });
});