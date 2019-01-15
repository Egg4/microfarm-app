'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/form/element/input-date-form-element',
    'lib/widget/form/element/input-time-form-element',
    'lib/widget/form/element/textarea-form-element',
    'lib/widget/form/element/checkbox-form-element',
    'lib/widget/form/label/form-label',
], function ($, _, Form, FormGroup, InputHidden, Select, InputDate, InputTime, Textarea, Checkbox, FormLabel) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                id: 'task-form',
                collection: app.collections.get('task'),
                formGroup: new FormGroup({
                    items: [
                        new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        new InputHidden({
                            name: 'entity_id',
                        }),
                        new Select({
                            name: 'crop_id',
                            optgroup: true,
                            nullable: true,
                            cast: 'integer',
                            data: this.buildCropData.bind(this),
                        }),
                        new InputHidden({
                            name: 'output_id',
                            nullable: true,
                        }),
                        new InputHidden({
                            name: 'organization_id',
                            nullable: true,
                        }),
                        new Select({
                            name: 'category_id',
                            optgroup: true,
                            cast: 'integer',
                            data: this.buildCategoryData.bind(this),
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new InputDate({
                                    name: 'date',
                                    css: {flex: '1'},
                                    placeholder: polyglot.t('form.placeholder.date'),
                                }),
                                new Select({
                                    name: 'time',
                                    css: {width: '8em'},
                                    data: this.buildTimeData.bind(this),
                                }),
                            ],
                        }),
                        new Textarea({
                            name: 'description',
                            placeholder: polyglot.t('form.placeholder.description'),
                            nullable: true,
                        }),
                        new FormGroup({
                            items: [
                                new Checkbox({
                                    name: 'done',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.done'),
                                    }),
                                    cast: 'boolean',
                                }),
                             ],
                        }),
                    ],
                }),
            });
        },

        buildCropData: function () {
            var data = app.collections.get('crop').map(function(crop) {
                return {
                    optgroup: crop.getDisplayName().charAt(0).removeDiacritics().toUpperCase(),
                    value: crop.get('id'),
                    label: crop.getDisplayName(),
                };
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        buildCategoryData: function () {
            var rootCategory = _.first(app.collections.get('category').where({
                parent_id: null,
                key: 'task_category_id',
            }));
            var cropProductionCategory = _.first(app.collections.get('category').where({
                parent_id: rootCategory.get('id'),
                key: 'crop_production',
            }));

            var data = [];
            _.each(cropProductionCategory.findAll('category', {refAttribute: 'parent_id'}), function(parentCategory) {
                _.each(parentCategory.findAll('category', {refAttribute: 'parent_id'}), function(category) {
                    data.push({
                        optgroup: parentCategory.getDisplayName(),
                        value: category.get('id'),
                        label: category.getDisplayName(),
                    });
                });
            });
            return _.groupBy(data, 'optgroup');
        },

        buildTimeData: function () {
            return _.map(_.range(6, 24, 1), function (index) {
                return {
                    value: index.pad(2) + ':00:00',
                    label: index.pad(2) + ':00',
                };
            });
        },
    });
});