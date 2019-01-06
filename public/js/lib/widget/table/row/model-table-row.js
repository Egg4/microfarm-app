'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/table/row/table-row',
], function ($, _, TableRow) {

    return TableRow.extend({
        events: {
            click: 'onClick',
            taphold: 'onHold',
        },

        initialize: function (options) {
            TableRow.prototype.initialize.call(this, options);

            $.extend(true, this, {
                model: false,
            }, _.pick(options, 'model'));

            $(this.el).addClass('model-table-row-widget');
        },

        data: function (model) {
            return model.toJSON();
        },

        render: function (options) {
            TableRow.prototype.render.call(this, options);

            options = options || {};
            this.model = options.data || this.model;
        },

        onClick: function () {
            this.table.onClickRow(this.model);
        },

        onHold: function () {
            this.table.onHoldRow(this.model);
        },
    });
});