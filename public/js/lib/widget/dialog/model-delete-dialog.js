'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/dialog/confirm-dialog',
    'view/widget/body/body',
    'view/widget/form/form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/checkbox-form-element',
], function ($, _, ConfirmDialog, Body, Form, FormGroup, Checkbox) {

    return ConfirmDialog.extend({

        initialize: function (options) {
            $.extend(true, this, {
                modelMutex: false,
            }, _.pick(options, 'modelMutex'));

            ConfirmDialog.prototype.initialize.call(this, $.extend(true, {
                title: 'Delete ' + options.modelName,
                body: new Body({
                    items: {
                        messageBody: new Body({template: _.template('<%= content %>')}),
                        form: new Form({
                            formGroup: new FormGroup({
                                items: {
                                    confirm: new Checkbox({
                                        name: 'confirm',
                                        label: 'Confirm deletion',
                                    }),
                                },
                            }),
                        }),
                    },
                }),
            }, options));

            $(this.el).addClass('model-delete-dialog-widget');
        },

        render: function (options) {
            this.model = options.model;

            ConfirmDialog.prototype.render.call(this, {
                message: 'Do you really want to delete "' + this.model.getDisplayName() + '"?',
            });

            this.body.items.form.render({
                data: {
                    confirm: false,
                },
            });
        },

        show: function (options) {
            this.deferred = $.Deferred();
            this.render(options);

            if (this.modelMutex) {
                var id = this.model.get('id');
                this.modelMutex.lock(id).done(function() {
                    this.open();
                }.bind(this));
            }
            else {
                this.open();
            }

            return this.deferred.promise();
        },

        onNo: function() {
            if (this.modelMutex) {
                var id = this.model.get('id');
                this.modelMutex.unlock(id).done(function () {
                    this.close().done(function () {
                        this.deferred.reject();
                    }.bind(this));
                }.bind(this));
            }
            else {
                this.close().done(function () {
                    this.deferred.reject();
                }.bind(this));
            }
        },

        onYes: function() {
            var confirm = this.body.items.form.getElement('confirm').getValue();
            if (confirm) {
                this.model.destroy();
                this.close().done(function() {
                    this.deferred.resolve();
                }.bind(this));
            }
        },
    });
});