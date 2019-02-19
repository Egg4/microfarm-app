'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/panel/panel',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
], function ($, _, Panel, List, ListItem) {

    return Panel.extend({

        initialize: function (options) {
            var defaults = {
                items: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Panel.prototype.initialize.call(this, $.extend(true, {
                dismissible: true,
                swipeClose: true,
                layout: this.buildList.bind(this),
            }, options));
        },

        buildList: function () {
            var items = _.isFunction(this.items) ? this.items() : this.items;
            return new List({
                items: _.map(items, this.buildListItem.bind(this)),
            });
        },

        buildListItem: function (item) {
            return new ListItem({
                content: item,
            });
        },
    });
});