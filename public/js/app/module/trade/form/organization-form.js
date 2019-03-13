'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/form/element/input-text-form-element',
    'lib/widget/form/element/input-number-form-element',
    'lib/widget/form/element/checkbox-form-element',
    'lib/widget/form/label/form-label',
], function ($, _, Form, FormGroup, InputHidden, Select, InputText, InputNumber, Checkbox, FormLabel) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                collection: app.collections.get('organization'),
                formGroup: new FormGroup({
                    items: [
                        new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        new InputHidden({
                            name: 'entity_id',
                        }),
                        new InputText({
                            name: 'name',
                            placeholder: polyglot.t('form.placeholder.name'),
                        }),
                        new InputText({
                            name: 'number',
                            placeholder: polyglot.t('form.placeholder.number'),
                            required: false,
                        }),
                        new FormGroup({
                            items: [
                                new Checkbox({
                                    name: 'supplier',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.supplier'),
                                    }),
                                    cast: 'boolean',
                                }),
                                new Checkbox({
                                    name: 'client',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.client'),
                                    }),
                                    cast: 'boolean',
                                }),
                            ],
                        }),
                    ],
                }),
            });
        },

        validator: function (data) {
            var errors = Form.prototype.validator.call(this, data);
            if (!data.supplier && !data.client) {
                errors.push({
                    attributes: ['supplier', 'client'],
                    message: polyglot.t('form.validator.at-least-one-option-required', {
                        field: polyglot.t('form.placeholder.supplier') + ', ' + polyglot.t('form.placeholder.client'),
                    }),
                });
            }
            return errors;
        },
    });
});