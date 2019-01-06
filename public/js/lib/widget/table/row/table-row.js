'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'tr',
        template: false,

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            $.extend(true, this, {
                table: false,
                data: this.data.bind(this),
            }, _.pick(options, 'table', 'data'));

            $(this.el).addClass('table-row-widget');
        },

        data: function (data) {
            return data;
        },

        render: function (options) {
            Widget.prototype.render.call(this, options);

            options = options || {};
            this.row = options.data || this.row;
            if (this.template) {
                $(this.el).html(this.template(this.data(options.data || {})));
            }
        },
    });
});