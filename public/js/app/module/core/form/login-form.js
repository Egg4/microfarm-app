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
                id: 'login-form',
                autocomplete: 'on',
                formGroup: new FormGroup({
                    items: [
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
                        // Submit button to force browser to trigger password remember dialog
                        new Input({
                            type: 'submit',
                            name: 'submit',
                            defaultValue: 'submit',
                        }),
                    ],
                }),
            });
        },

        render: function () {
            Form.prototype.render.call(this);

            // Hide submit button
            var submitInput = this.getElement('submit');
            $(submitInput.el).hide(0);
        },

        getData: function() {
            var data = Form.prototype.getData.call(this);
            delete data['submit'];
            return data;
        },

        submit: function() {
            var deferred = $.Deferred();
            if (!this.validate()) return deferred.reject();

            app.client.send({
                method: 'POST',
                url: '/user/login',
                data: this.getData(),
                catchErrors: ['invalid_content', 'authentication_failure'],
            }).done(function(data) {
                // Simulate submit button click
                var submitInput = this.getElement('submit');
                $(submitInput.element).click();
                deferred.resolve(data);
            }.bind(this)).fail(function(errors) {
                this.showErrors(this.parseServerErrors(errors));
                deferred.reject();
            }.bind(this));

            return deferred.promise();
        },

        parseServerErrors: function (serverErrors) {
            var errors = [];
            _.each(serverErrors, function(serverError) {
                if (serverError.name == 'authentication_failure') {
                    errors.push({
                        attributes: ['email', 'password'],
                        message: serverError.description
                    });
                }
                if (serverError.description.match(/Email/)) {
                    errors.push({
                        attributes: ['email'],
                        message: serverError.description
                    });
                }
                if (serverError.description.match(/Password/)) {
                    errors.push({
                        attributes: ['password'],
                        message: serverError.description
                    });
                }
            }.bind(this));

            return errors;
        },
    });
});