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
                    template: _.template('<%= content %>'),
                }),
                buttons: {
                    close: new Button({
                        text: 'Close',
                        icon: 'check',
                        theme: 'b',
                        events: {
                            click: this.onClose.bind(this),
                        },
                    }),
                },
            }, options));

            $(this.el).addClass('alert-dialog-widget');
        },

        render: function (options) {
            Dialog.prototype.render.call(this, options);

            this.body.render({
                content: options.message,
            });
        },

        show: function (options) {
            this.deferred = $.Deferred();
            this.render(options);
            this.open();
            return this.deferred.promise();
        },

        onClose: function() {
            this.close().done(function() {
                this.deferred.resolve();
            }.bind(this));
        },
    });
});