'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/popup/popup',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
], function ($, _, Popup, List, ListItem) {

    return Popup.extend({

        initialize: function (options) {
            var defaults = {
                items: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Popup.prototype.initialize.call(this, $.extend(true, {
                dismissible: true,
                body: this.buildList.bind(this),
            }, options));
        },

        buildList: function () {
            var items = _.isFunction(this.items) ? this.items() : this.items;
            return new List({
                items: _.map(items, function(item) {
                    return this.buildListItem(item);
                }.bind(this)),
            });
        },

        buildListItem: function (item) {
            return new ListItem({
                content: item,
            });
        },
    });
});