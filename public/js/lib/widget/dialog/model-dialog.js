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
            $.extend(true, this, {
                modelForm: false,
                modelMutex: false,
            }, _.pick(options, 'modelForm', 'modelMutex'));

            Dialog.prototype.initialize.call(this, $.extend(true, {
                body: new Body({
                    items: {
                        modelForm: this.modelForm,
                    },
                }),
                buttons: {
                    cancel: new Button({
                        text: 'Cancel',
                        icon: 'times',
                        theme: 'a',
                        events: {
                            click: this.onCancel.bind(this),
                        },
                    }),
                    save: new Button({
                        text: 'Save',
                        icon: 'check',
                        theme: 'b',
                        events: {
                            click: this.onSave.bind(this),
                        },
                    }),
                },
            }, options));

            $(this.el).addClass('model-dialog-widget');
        },

        render: function (options) {
            Dialog.prototype.render.call(this, options);

            if (this.modelForm) {
                this.modelForm.render({
                    data: options.form.data || {},
                    visibility: options.form.visibility || {},
                });
            }
        },

        show: function (options) {
            this.deferred = $.Deferred();
            this.render(options);

            var id = this.modelForm.getElement('id').getValue();
            if (id && this.modelMutex) {
                this.modelMutex.lock(id).done(function() {
                    this.open();
                }.bind(this));
            }
            else {
                this.open();
            }

            return this.deferred.promise();
        },

        onCancel: function() {
            var id = this.modelForm.getElement('id').getValue();
            if (id && this.modelMutex) {
                this.modelMutex.unlock(id).done(function() {
                    this.close().done(function() {
                        this.deferred.reject();
                    }.bind(this));
                }.bind(this));
            }
            else {
                this.close().done(function() {
                    this.deferred.reject();
                }.bind(this));
            }
        },

        onSave: function() {
            this.modelForm.submit().done(function() {
                this.close().done(function() {
                    this.deferred.resolve();
                }.bind(this));
            }.bind(this));
        },
    });
});