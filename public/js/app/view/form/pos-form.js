'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/input-text-form-element',
], function ($, _, Form, FormGroup, InputHidden, InputText) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'pos-form',
                collection: app.collections.get('pos'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        name: new InputText({
                            name: 'name',
                            placeholder: 'Name',
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid name';
                                }
                            },
                        }),
                    },
                }),
            }, options));
        },

        validate: function (data) {
            var errors = [];
            if (!this.collection.checksUniqueKey(data, ['name'])) {
                errors.push({
                    attributes: ['name'],
                    message: 'This point of sale already exists',
                });
            }
            return errors;
        },
    });
});