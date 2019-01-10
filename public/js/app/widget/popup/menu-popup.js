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
                body: this.buildList(),
            }, options));
        },

        buildList: function () {
            return new List({
                items: function () {
                    return _.map(this.items, function(item) {
                        return this.buildListItem(item);
                    }.bind(this));
                }.bind(this),
            });
        },

        buildListItem: function (item) {
            return new ListItem({
                content: item,
            });
        },
    });
});