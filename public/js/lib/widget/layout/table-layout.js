'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/layout/layout',
], function ($, _, Layout) {

    return Layout.extend({
        tagName: 'table',

        initialize: function (options) {
            Layout.prototype.initialize.call(this, options);

            var defaults = {
                items: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('table-layout-widget');
        },

        render: function () {
            Layout.prototype.render.call(this);

            var items = _.isFunction(this.items) ? this.items() : this.items;
            _.each(items, function (row) {
                if (!_.isArray(row)) {
                    throw new Error('Row should be array type');
                }
                var tr = $('<tr>');
                _.each(row, function (item) {
                    var td = $('<td>'),
                        item = _.isFunction(item) ? item() : item;
                    td.append(item.el);
                    item.render();
                    tr.append(td);
                });
                $(this.el).append(tr);
            }.bind(this));
        },
    });
});