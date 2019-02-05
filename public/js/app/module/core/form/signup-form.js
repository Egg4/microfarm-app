'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-form-element',
    'lib/widget/form/element/input-text-form-element',
    'lib/widget/form/element/input-password-form-element',
], function ($, _, Form, FormGroup, Input, InputText, InputPassword) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                id: 'signup-form',
                formGroup: new FormGroup({
                    items: [
                        new InputText({
                            name: 'first_name',
                            placeholder: polyglot.t('form.placeholder.first_name'),
                        }),
                        new InputText({
                            name: 'last_name',
                            placeholder: polyglot.t('form.placeholder.last_name'),
                        }),
                        new InputText({
                            name: 'email',
                            placeholder: polyglot.t('form.placeholder.email'),
                            validator: function (value) {
                                if (!value.isEmail()) {
                                    return polyglot.t('form.validator.email', {
                                        field: polyglot.t('form.field.email'),
                                    });
                                }
                            },
                        }),
                        new InputPassword({
                            name: 'password',
                            placeholder: polyglot.t('form.placeholder.password'),
                            validator: function (value) {
                                if (value.length < 8) {
                                    return polyglot.t('form.validator.at-least-x-chars-required', {
                                        field: polyglot.t('form.field.password'),
                                        charCount: 8,
                                    });
                                }
                                if (value.length > 64) {
                                    return polyglot.t('form.validator.at-most-x-chars-required', {
                                        field: polyglot.t('form.field.password'),
                                        charCount: 64,
                                    });
                                }
                            },
                        }),
                        new InputPassword({
                            name: 'password_confirm',
                            placeholder: polyglot.t('form.placeholder.password_confirm'),
                            validator: function (value) {
                                if (value.length < 8) {
                                    return polyglot.t('form.validator.at-least-x-chars-required', {
                                        field: polyglot.t('form.field.password_confirm'),
                                        charCount: 8,
                                    });
                                }
                                if (value.length > 64) {
                                    return polyglot.t('form.validator.at-most-x-chars-required', {
                                        field: polyglot.t('form.field.password_confirm'),
                                        charCount: 64,
                                    });
                                }
                            },
                        }),
                    ],
                }),
            });
        },

        validator: function (data) {
            var errors = Form.prototype.validator.call(this, data);

            if (data.password !== data.password_confirm) {
                errors.push({
                    attributes: ['password', 'password_confirm'],
                    message: polyglot.t('form.validator.password_not_equal'),
                });
            }

            return errors;
        },

        submit: function() {
            var deferred = $.Deferred();
            if (!this.validate()) return deferred.reject();

            var data = this.getData();
            delete data.password_confirm;

            app.client.send({
                method: 'POST',
                url: '/user/signup',
                data: data,
                catchErrors: ['invalid_content', 'not_unique'],
            }).done(function(data) {
                deferred.resolve(data);
            }).fail(function(errors) {
                this.showErrors(this.parseServerErrors(errors));
                deferred.reject();
            }.bind(this));

            return deferred.promise();
        },

        parseServerErrors: function (serverErrors) {
            var errors = [];
            _.each(serverErrors, function(serverError) {
                if (serverError.name == 'not_unique') {
                    errors.push({
                        attributes: ['email'],
                        message: polyglot.t('form.validator.not-unique', {
                            model: 'Email'
                        }),
                    });
                }
            }.bind(this));

            return errors;
        },
    });
});