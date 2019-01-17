'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
    'lib/widget/layout/stack-layout',
    'lib/widget/table/table',
], function ($, _, Widget, StackLayout, Table) {

    return Widget.extend({

        initialize: function (options) {
            var defaults = {
                header: false,
                filterId: false,
                rows: [],
                footer: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Widget.prototype.initialize.call(this, options);
        },

        buildLayout: function () {
            var items = [];
            if (this.header) {
                var header = _.isFunction(this.header) ? this.header() : this.header;
                items.push(header);
            }
            items.push(this.buildTable());
            if (this.footer) {
                var footer = _.isFunction(this.footer) ? this.footer() : this.footer;
                items.push(footer);
            }

            return new StackLayout({
                items: items,
            });
        },

        buildTable: function () {
            return new Table({
                filterId: this.filterId,
                rows: this.rows,
            });
        },

        render: function () {
            Widget.prototype.render.call(this);

            var layout = this.buildLayout();
            $(this.el).html(layout.el);
            layout.render();
        },
    });
});