'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/widget',
    'view/widget/form/element/input-search-form-element',
], function ($, _, Widget, InputSearch) {

    return Widget.extend({
        tagName: 'div',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            $.extend(true, this, {
                header: false,
                headRow: false,
                bodyRow: false,
                footRow: false,
                footer: false,
                data: this.data.bind(this),
                filterable: false,
                filterInput: false,
            }, _.pick(options, 'header', 'headRow', 'bodyRow', 'footRow', 'footer', 'data', 'filterable', 'filterInput'));

            $(this.el).addClass('table-widget');

            if (this.header) {
                $(this.el).append(this.header.el);
            }
            $(this.el).append('<table><thead></thead><tbody></tbody><tfoot></tfoot></table>');
            if (this.filterable) {
                this.$('table').attr('data-filter', 'true');
            }
            if (this.filterInput) {
                if (this.filterInput instanceof InputSearch) {
                    this.$('table').attr('data-input', true);
                    this.filterInput.on('keyup', this.filter.bind(this));
                }
                else {
                    this.$('table').attr('data-input', this.filterInput);
                }
            }
            this.$('table').table();

            if (this.footer) {
                $(this.el).append(this.footer.el);
            }
        },

        filter: function() {
            this.$('table').filterable('setInput', '#' + this.filterInput.getElementId());
            this.$('table').filterable('refresh');
        },

        data: function () {
            return [];
        },

        renderHead: function () {
            var headRow = new this.headRow();
            headRow.render();
            this.$('thead').html(headRow.el);
        },

        renderBody: function (data) {
            this.$('tbody').empty();
            _.each(data, function(item) {
                this.appendBodyRow(item);
            }.bind(this));
        },

        appendBodyRow: function (data) {
            var bodyRow = new this.bodyRow({table: this});
            bodyRow.render({data: data});
            this.$('tbody').append(bodyRow.el);
        },

        renderFoot: function () {
            var footRow = new this.footRow();
            footRow.render();
            this.$('tfoot').html(footRow.el);
        },

        render: function (options) {
            Widget.prototype.render.call(this, options);

            options = options || {};
            if (this.headRow) {
                this.renderHead();
            }
            if (this.bodyRow) {
                this.renderBody(this.data(options.data, options.navigationKey));
            }
            if (this.footRow) {
                this.renderFoot();
            }

            if (this.filterable) {
                if (this.filterInput instanceof InputSearch) {
                    this.filter();
                }
            }
        },
    });
});