'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/popup/confirm-popup',
    'lib/widget/layout/stack-layout',
    'lib/widget/html/html',
    'lib/widget/form/form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/checkbox-form-element',
    'lib/widget/form/label/form-label',
], function ($, _, Popup, StackLayout, Html, Form, FormGroup, Checkbox, FormLabel) {

    return Popup.extend({

        initialize: function (options) {
            Popup.prototype.initialize.call(this, $.extend(true, {
                id: 'delete-popup',
                body: this.buildBody(),
            }, options));
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildHtml(),
                    this.buildFrom(),
                ],
            });
        },

        buildHtml: function () {
            return new Html({
                template: '<%= message %>',
            });
        },

        buildFrom: function () {
            return new Form({
                formGroup: new FormGroup({
                    items: [
                        new Checkbox({
                            name: 'confirm',
                            label: new FormLabel({
                                text: polyglot.t('delete-popup.checkbox.label'),
                            }),
                            cast: 'boolean',
                        }),
                    ],
                }),
            });
        },

        getHtml: function () {
            return this.body.items[0];
        },

        getForm: function () {
            return this.body.items[1];
        },

        render: function () {
            var html = this.getHtml(),
                form = this.getForm();
            html.data = {
                message: this.message,
            };
            form.setData({
                confirm: false,
            });
            Popup.prototype.render.call(this);
        },

        onYes: function () {
            var form = this.getForm(),
                confirm = form.getElement('confirm').getValue();

            if (confirm) {
                this.close().done(function() {
                    this.deferred.resolve();
                }.bind(this));
            }
        },
    });
});