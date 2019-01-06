'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/dialog/alert-dialog',
    'view/widget/body/body',
], function ($, _, AlertDialog, Body) {

    return AlertDialog.extend({

        initialize: function (options) {
            AlertDialog.prototype.initialize.call(this, $.extend(true, {
                body: new Body({
                    template: _.template('<ul><%_.each(content.errors, function(error) {%><li><%- error.name %>: <%- error.description %></li><%});%></ul>'),
                }),
            }, options));

            $(this.el).addClass('error-dialog-widget');
        },

        render: function (options) {
            this.header.render({
                title: options.title,
            });
            this.body.render({
                content: {
                    errors: options.errors,
                },
            });
        },
    });
});