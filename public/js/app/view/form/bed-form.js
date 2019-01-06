'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-number-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputNumber) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'bed-form',
                collection: app.collections.get('bed'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        entity_id: new InputHidden({
                            name: 'entity_id',
                        }),
                        block_id: new Select({
                            name: 'block_id',
                            cast: 'integer',
                            data: this.buildBlockData.bind(this),
                        }),
                        name: new InputNumber({
                            name: 'name',
                            min: 1,
                            max: 255,
                            step: 1,
                            cast: 'integer',
                            placeholder: 'Number',
                            validator: function (value) {
                                if (value <= 0) {
                                    return 'Invalid name';
                                }
                            },
                        }),
                    },
                }),
            }, options));
        },

        buildBlockData: function () {
            var data = [];
            app.collections.get('block').each(function(block) {
                data.push({
                    value: block.get('id'),
                    label: block.getDisplayName(),
                });
            });
            return data;
        },
    });
});