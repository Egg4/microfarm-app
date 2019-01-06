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
                column: 2,
                items: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('grid-layout-widget');
        },

        render: function () {
            Layout.prototype.render.call(this);

            $(this.el).removeClassPattern(/(^|\s)ui-grid-\S+/g);

            var gridIndex = this.column - 1;
            $(this.el).addClass('ui-grid-' + (gridIndex == 0 ? 'solo' : gridIndex.toAlpha()));

            var items = _.isFunction(this.items) ? this.items() : this.items;
            _.each(items, function (item, index) {
                var block = $('<div>'),
                    blockIndex = index % this.column + 1;
                    item = _.isFunction(item) ? item() : item;
                block.addClass('ui-block-' + blockIndex.toAlpha());
                block.append(item.el);
                $(this.el).append(block);
                item.render();
            }.bind(this));
        },
    });
});