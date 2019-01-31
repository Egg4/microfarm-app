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
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Form, FormGroup, InputHidden, Select, InputDate, InputTime, Textarea, Checkbox, FormLabel, Button, Label, Icon) {

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
                            cast: 'integer',
                        }),
                        new InputHidden({
                            name: 'entity_id',
                            cast: 'integer',
                        }),
                        new Select({
                            name: 'category_id',
                            placeholder: polyglot.t('form.placeholder.category_id'),
                            optgroup: true,
                            cast: 'integer',
                            data: this.buildCategoryData.bind(this),
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'crop_id',
                                    placeholder: polyglot.t('form.placeholder.crop_id'),
                                    optgroup: true,
                                    nullable: true,
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildCropData.bind(this),
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openCropCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'output_id',
                                    placeholder: polyglot.t('form.placeholder.output_id'),
                                    optgroup: true,
                                    nullable: true,
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildOutputData.bind(this),
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openOutputCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                        new InputHidden({
                            name: 'organization_id',
                            nullable: true,
                            cast: 'integer',
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new InputDate({
                                    name: 'date',
                                    placeholder: polyglot.t('form.placeholder.date'),
                                    css: {flex: '1'},
                                }),
                                new Select({
                                    name: 'time',
                                    placeholder: polyglot.t('form.placeholder.time'),
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

        buildCategoryData: function () {
            var cropId = this.getElement('crop_id').getValue(),
                outputId = this.getElement('output_id').getValue(),
                organizationId = this.getElement('organization_id').getValue();

            if (!_.isNull(cropId)) return this.buildCropCategoryData();
            if (!_.isNull(outputId)) return this.buildOutputCategoryData();
            //if (!_.isNull(organizationId)) return this.buildOrganizationCategoryData();
        },

        buildCropCategoryData: function () {
            var cropProductionCategory = app.collections.get('category').findRoot('task_category_id').findChild({
                key: 'crop_production',
            });

            var data = [];
            _.each(cropProductionCategory.findChildren(), function(parentCategory) {
                _.each(parentCategory.findChildren(), function(category) {
                    if (_.contains(['primary', 'maintenance', 'destruction'], parentCategory.get('key'))) {
                        data.push({
                            optgroup: parentCategory.getDisplayName(),
                            value: category.get('id'),
                            label: category.getDisplayName(),
                        });
                    }
                });
            });
            return _.groupBy(data, 'optgroup');
        },

        buildOutputCategoryData: function () {
            var postProductionCategory = app.collections.get('category').findRoot('task_category_id').findChild({
                key: 'post_production',
            });

            var data = [];
            _.each(postProductionCategory.findChildren(), function(category) {
                data.push({
                    optgroup: '',
                    value: category.get('id'),
                    label: category.getDisplayName(),
                });
            });
            return _.groupBy(data, 'optgroup');
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

        openCropCreationDialog: function () {
            var dialog = app.dialogs.get('crop');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.crop').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
            });
            dialog.form.setVisible({
                article_id: true,
                number: true,
            });
            dialog.open().done(function (crop) {
                var cropSelect = this.getElement('crop_id');
                cropSelect.setValue(crop.get('id'));
                cropSelect.render();
                $(cropSelect.el).trigger('change');
            }.bind(this));
        },

        buildOutputData: function () {
            var data = app.collections.get('output').map(function(output) {
                return {
                    optgroup: output.find('task').find('crop').find('article').getDisplayName(),
                    value: output.get('id'),
                    label: output.getDisplayName(),
                };
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        openOutputCreationDialog: function () {
            var dialog = app.dialogs.get('output');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.output').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
            });
            dialog.form.setVisible({
                task_id: true,
                article_id: true,
                variety_id: true,
                quantity: true,
            });
            dialog.open().done(function (output) {
                var outputSelect = this.getElement('output_id');
                outputSelect.setValue(output.get('id'));
                outputSelect.render();
                $(outputSelect.el).trigger('change');
            }.bind(this));
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