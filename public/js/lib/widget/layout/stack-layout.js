'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/layout/layout',
], function ($, _, Layout) {

    return Layout.extend({

        initialize: function (options) {
            Layout.prototype.initialize.call(this, options);

            var defaults = {
                items: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('stack-layout-widget');
        },

        render: function () {
            Layout.prototype.render.call(this);

            var items = _.isFunction(this.items) ? this.items() : this.items;
            _.each(items, function (item) {
                var item = _.isFunction(item) ? item() : item;
                $(this.el).append(item.el);
                item.render();
            }.bind(this));
        },
    });
});