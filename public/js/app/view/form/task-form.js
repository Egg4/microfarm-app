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
                id: 'task-form',
                collection: app.collections.get('task'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        provider_id: new Select({
                            name: 'provider_id',
                            nullable: true,
                            data: this.getProviderData.bind(this),
                            events: {
                                change: this.onProviderChange.bind(this),
                            },
                        }),
                        crop_id: new Select({
                            name: 'crop_id',
                            nullable: true,
                            data: this.getCropData.bind(this),
                            events: {
                                change: this.onCropChange.bind(this),
                            },
                        }),
                        pos_id: new Select({
                            name: 'pos_id',
                            nullable: true,
                            data: this.getPosData.bind(this),
                            events: {
                                change: this.onPosChange.bind(this),
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
                        planned_date: new InputDate({
                            name: 'planned_date',
                            placeholder: 'Planned date',
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid planned date';
                                }
                            },
                        }),
                        status: new Select({
                            name: 'status',
                            defaultValue: 'planned',
                            data: [
                                {value: 'planned', label: 'Planned'},
                                {value: 'in_progress', label: 'In progress'},
                                {value: 'complete', label: 'Complete'},
                            ],
                        }),
                        description: new Textarea({
                            name: 'description',
                            placeholder: 'Description',
                            nullable: true,
                        }),
                    },
                }),
            }, options));
        },

        getProviderData: function () {
            var data = [{
                value: '',
                label: 'None',
            }];
            app.collections.get('provider').each(function (provider) {
                data.push({
                    value: provider.get('id'),
                    label: provider.getDisplayName(),
                });
            });
            return data;
        },

        getCropData: function () {
            var data = [{
                value: '',
                label: 'None',
            }];
            app.collections.get('crop').each(function (crop) {
                data.push({
                    value: crop.get('id'),
                    label: crop.getDisplayName() + ' (' + crop.get('status') + ')',
                });
            });
            return _.sortBy(data, 'optgroup');
        },

        getPosData: function () {
            var data = [{
                value: '',
                label: 'None',
            }];
            app.collections.get('pos').each(function (pos) {
                data.push({
                    value: pos.get('id'),
                    label: pos.getDisplayName(),
                });
            });
            return data;
        },

        getCategoryData: function () {
            var data = [];
            var provider_id = this.getElement('provider_id').getValue();
            var crop_id = this.getElement('crop_id').getValue();
            var pos_id = this.getElement('pos_id').getValue();
            var categories = [];
            if (provider_id !== null) {
                categories = app.collections.get('category').where({
                    model: 'task',
                    root: 'purchasing',
                });
            }
            if (crop_id !== null) {
                categories = app.collections.get('category').where({
                    model: 'task',
                    root: 'cultivation',
                });
            }
            if (pos_id !== null) {
                categories = app.collections.get('category').where({
                    model: 'task',
                    root: 'marketing',
                });
            }
            _.each(categories, function (category) {
                data.push({
                    optgroup: category.get('group'),
                    value: category.get('id'),
                    label: category.getDisplayName(),
                });
            });
            return _.groupBy(data, 'optgroup');
        },

        onProviderChange: function () {
            this.renderCropSelect();
            this.renderPosSelect();
            this.renderCategorySelect();
        },

        onCropChange: function () {
            this.renderProviderSelect();
            this.renderPosSelect();
            this.renderCategorySelect();
        },

        onPosChange: function () {
            this.renderProviderSelect();
            this.renderCropSelect();
            this.renderCategorySelect();
        },

        renderProviderSelect: function () {
            this.getElement('provider_id').setValue('');
            this.getElement('provider_id').render();
        },

        renderCropSelect: function () {
            this.getElement('crop_id').setValue('');
            this.getElement('crop_id').render();
        },

        renderPosSelect: function () {
            this.getElement('pos_id').setValue('');
            this.getElement('pos_id').render();
        },

        renderCategorySelect: function () {
            this.getElement('category_id').setValue('');
            this.getElement('category_id').render();
        },

        validate: function (data) {
            var errors = [];
            if (!this.collection.checksUniqueKey(data, ['provider_id', 'crop_id', 'pos_id', 'category_id', 'planned_date'])) {
                errors.push({
                    attributes: ['provider_id', 'crop_id', 'pos_id', 'category_id', 'planned_date'],
                    message: 'This task already exists',
                });
            }
            if (data.provider_id == null && data.crop_id == null && data.pos_id == null) {
                errors.push({
                    attributes: ['provider_id', 'crop_id', 'pos_id'],
                    message: 'Provider & crop & pos cannot be null',
                });
            }
            return errors;
        },
    });
});