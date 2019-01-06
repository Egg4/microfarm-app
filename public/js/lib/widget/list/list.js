'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'ul',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                items: {},
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('list-widget');
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).empty();
            var items = _.isFunction(this.items) ? this.items() : this.items;
            _.each(items, function (item) {
                var item = _.isFunction(item) ? item() : item;
                $(this.el).append(item.el);
                item.render();
            }.bind(this));
        },
    });
});