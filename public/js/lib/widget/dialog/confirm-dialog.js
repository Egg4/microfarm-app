'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/dialog/dialog',
    'view/widget/body/body',
    'view/widget/button/button',
], function ($, _, Dialog, Body, Button) {

    return Dialog.extend({

        initialize: function (options) {
            Dialog.prototype.initialize.call(this, $.extend(true, {
                body: new Body({
                    items: {
                        messageBody: new Body({template: _.template('<%= content %>')}),
                    },
                }),
                buttons: {
                    no: new Button({
                        text: 'No',
                        icon: 'times',
                        theme: 'a',
                        events: {
                            click: this.onNo.bind(this),
                        },
                    }),
                    yes: new Button({
                        text: 'Yes',
                        icon: 'check',
                        theme: 'b',
                        events: {
                            click: this.onYes.bind(this),
                        },
                    }),
                },
            }, options));

            $(this.el).addClass('confirm-dialog-widget');
        },

        render: function (options) {
            Dialog.prototype.render.call(this, options);

            this.body.items.messageBody.render({
                content: options.message,
            });
        },

        show: function (options) {
            this.deferred = $.Deferred();
            this.render(options);
            this.open();
            return this.deferred.promise();
        },

        onNo: function() {
            this.close().done(function() {
                this.deferred.reject();
            }.bind(this));
        },

        onYes: function() {
            this.close().done(function() {
                this.deferred.resolve();
            }.bind(this));
        },
    });
});