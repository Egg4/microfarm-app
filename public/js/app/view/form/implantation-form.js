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
                id: 'implantation-form',
                collection: app.collections.get('implantation'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        bed_id: new Select({
                            name: 'bed_id',
                            optgroup: true,
                            data: this.getBedData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid bed';
                                }
                            },
                        }),
                        crop_id: new Select({
                            name: 'crop_id',
                            data: this.getCropData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid crop';
                                }
                            },
                        }),
                        dimensions: new FormGroup({
                            type: 'horizontal',
                            items: {
                                density: new InputNumber({
                                    name: 'density',
                                    css: {width: '34%'},
                                    placeholder: 'Density',
                                    min: 0,
                                    validator: function (value) {
                                        if (value.length == 0 || parseFloat(value) <= 0) {
                                            return 'Invalid density';
                                        }
                                    },
                                }),
                                length: new InputNumber({
                                    name: 'length',
                                    css: {width: '34%'},
                                    placeholder: 'Length',
                                    min: 0,
                                    validator: function (value) {
                                        if (value.length == 0 || parseFloat(value) <= 0) {
                                            return 'Invalid length';
                                        }
                                    },
                                }),
                                unit: new Select({
                                    name: 'unit',
                                    css: {width: '32%'},
                                    defaultValue: 'm',
                                    data: [
                                        {value: 'cm', label: 'cm'},
                                        {value: 'm', label: 'm'},
                                    ],
                                }),
                            },
                        }),
                    },
                }),
            }, options));
        },

        getBedData: function () {
            var data = [];
            app.collections.get('bed').each(function(bed) {
                data.push({
                    optgroup: bed.find('block').getDisplayName(),
                    value: bed.get('id'),
                    label: bed.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        getCropData: function () {
            var data = [];
            app.collections.get('crop').each(function(crop) {
                data.push({
                    value: crop.get('id'),
                    label: crop.getDisplayName() + ' (' + crop.get('status') + ')',
                });
            });
            return _.sortBy(data, 'label');
        },

        validate: function (data) {
            var errors = [];
            if (!this.collection.checksUniqueKey(data, ['bed_id', 'crop_id'])) {
                errors.push({
                    attributes: ['bed_id', 'crop_id'],
                    message: 'This implantation already exists',
                });
            }
            return errors;
        },
    });
});