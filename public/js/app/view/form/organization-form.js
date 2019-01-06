'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-text-form-element',
    'view/widget/form/element/input-number-form-element',
    'view/widget/form/element/checkbox-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputText, InputNumber, Checkbox) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'organization-form',
                collection: app.collections.get('organization'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        entity_id: new InputHidden({
                            name: 'entity_id',
                        }),
                        name: new InputText({
                            name: 'name',
                            placeholder: 'Name',
                        }),
                        number: new InputText({
                            name: 'number',
                            placeholder: 'Number',
                            required: false,
                        }),
                        formGroup: new FormGroup({
                            items: {
                                supplier: new Checkbox({
                                    name: 'supplier',
                                    label: 'Fournisseur',
                                    cast: 'boolean',
                                }),
                                client: new Checkbox({
                                    name: 'client',
                                    label: 'Client',
                                    cast: 'boolean',
                                }),
                            },
                        }),
                    },
                }),
            }, options));
        },

        validate: function (data) {
            var errors = [];
            if (!data.supplier && !data.client) {
                errors.push({
                    attributes: ['supplier', 'client'],
                    message: 'Choose at least one option',
                });
            }
            return errors;
        },
    });
});