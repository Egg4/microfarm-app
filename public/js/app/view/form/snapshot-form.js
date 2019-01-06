'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-date-form-element',
    'view/widget/form/element/input-number-form-element',
    'view/widget/form/element/textarea-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputDate, InputNumber, Textarea) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'snapshot-form',
                collection: app.collections.get('snapshot'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        crop_id: new Select({
                            name: 'crop_id',
                            data: this.getCropData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid bed';
                                }
                            },
                        }),
                        category_id: new Select({
                            name: 'category_id',
                            optgroup: true,
                            data: this.getCategoryData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid category';
                                }
                            },
                        }),
                        type: new Select({
                            name: 'type',
                            defaultValue: 'count',
                            data: [
                                {value: 'count', label: 'Count'},
                                {value: 'height', label: 'Height'},
                                {value: 'width', label: 'Width'},
                                {value: 'density', label: 'Density'},
                            ],
                        }),
                        date: new InputDate({
                            name: 'date',
                            placeholder: 'Date',
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid date';
                                }
                            },
                        }),
                        measure: new FormGroup({
                            type: 'horizontal',
                            items: {
                                min: new InputNumber({
                                    name: 'min',
                                    css: {width: '34%'},
                                    placeholder: 'Min',
                                    min: 0,
                                    validator: function (value) {
                                        if (value.length == 0 || parseFloat(value) <= 0) {
                                            return 'Invalid min';
                                        }
                                    },
                                }),
                                max: new InputNumber({
                                    name: 'max',
                                    css: {width: '34%'},
                                    placeholder: 'Max',
                                    min: 0,
                                    validator: function (value) {
                                        if (value.length == 0 || parseFloat(value) <= 0) {
                                            return 'Invalid max';
                                        }
                                    },
                                }),
                                unit: new Select({
                                    name: 'unit',
                                    css: {width: '32%'},
                                    defaultValue: 'm',
                                    data: [
                                        {value: 'unit', label: 'unit'},
                                        {value: 'cm', label: 'cm'},
                                        {value: 'm', label: 'm'},
                                        {value: 'cm²', label: 'cm²'},
                                        {value: 'm²', label: 'm²'},
                                    ],
                                }),
                            },
                        }),
                        description: new Textarea({
                            name: 'description',
                            nullable: true,
                            placeholder: 'Description',
                        }),
                    },
                }),
            }, options));
        },

        getCropData: function () {
            var data = [];
            app.collections.get('crop').each(function (crop) {
                data.push({
                    value: crop.get('id'),
                    label: crop.getDisplayName() + ' (' + crop.get('status') + ')',
                });
            });
            return _.sortBy(data, 'optgroup');
        },

        getCategoryData: function () {
            var data = [];
            var categories = app.collections.get('category').where({model: 'snapshot'});
            _.each(categories, function (category) {
                data.push({
                    optgroup: category.get('group'),
                    value: category.get('id'),
                    label: category.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        validate: function (data) {
            var errors = [];
            if (!this.collection.checksUniqueKey(data, ['crop_id', 'category_id', 'type', 'date'])) {
                errors.push({
                    attributes: ['crop_id', 'category_id', 'type', 'date'],
                    message: 'This snapshot already exists',
                });
            }
            return errors;
        },
    });
});