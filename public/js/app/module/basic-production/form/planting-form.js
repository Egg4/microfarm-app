'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/form/element/input-number-form-element',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Form, FormGroup, InputHidden, Select, InputNumber, Button, Label, Icon) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                collection: app.collections.get('planting'),
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
                        new InputHidden({
                            name: 'task_id',
                            cast: 'integer',
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'article_id',
                                    placeholder: polyglot.t('form.placeholder.article_id'),
                                    optgroup: true,
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildArticleData.bind(this),
                                    events: {
                                        change: this.resetVarietySelect.bind(this),
                                    },
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openArticleCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                        new InputHidden({
                            name: 'output_id',
                            nullable: true,
                            defaultValue: null,
                            cast: 'integer',
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'variety_id',
                                    placeholder: polyglot.t('form.placeholder.variety_id'),
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildVarietyData.bind(this),
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openVarietyCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                        new Select({
                            name: 'category_id',
                            placeholder: polyglot.t('form.placeholder.category_id'),
                            cast: 'integer',
                            data: this.buildCategoryData.bind(this),
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new InputNumber({
                                    name: 'intra_row_spacing',
                                    placeholder: polyglot.t('form.placeholder.intra_row_spacing'),
                                    min: 1,
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    validator: function (value) {
                                        if (_.isNaN(value) || value < 1) {
                                            return polyglot.t('form.validator.greater-or-equal', {
                                                field: polyglot.t('form.field.intra_row_spacing'),
                                                value: 1,
                                            });
                                        }
                                    },
                                }),
                                new Button({
                                    css: {width: '8em'},
                                    label: new Label({text: 'cm'}),
                                }),
                            ],
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new InputNumber({
                                    name: 'inter_row_spacing',
                                    placeholder: polyglot.t('form.placeholder.inter_row_spacing'),
                                    min: 1,
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    validator: function (value) {
                                        if (_.isNaN(value) || value < 1) {
                                            return polyglot.t('form.validator.greater-or-equal', {
                                                field: polyglot.t('form.field.inter_row_spacing'),
                                                value: 1,
                                            });
                                        }
                                    },
                                }),
                                new Button({
                                    css: {width: '8em'},
                                    label: new Label({text: 'cm'}),
                                }),
                            ],
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new InputNumber({
                                    name: 'area',
                                    placeholder: polyglot.t('form.placeholder.area'),
                                    min: 0,
                                    cast: 'float',
                                    css: {flex: '1'},
                                    validator: function (value) {
                                        if (_.isNaN(value) || value <= 0) {
                                            return polyglot.t('form.validator.greater', {
                                                field: polyglot.t('form.field.area'),
                                                value: 0,
                                            });
                                        }
                                    },
                                }),
                                new Button({
                                    css: {width: '8em'},
                                    label: new Label({text: 'm²'}),
                                }),
                            ],
                        }),
                    ],
                }),
            });
        },

        getVarietyFormGroup: function () {
            return this.formGroup.items[5];
        },

        buildArticleData: function () {
            var data = [],
                entityId = app.authentication.get('entity_id'),
                entity = app.collections.get('entity').get(entityId),
                taskId = this.getElement('task_id').getValue(),
                task = app.collections.get('task').get(taskId),
                plantCategory = app.collections.get('category').findRoot('article_category_id').findChild({
                    key: 'plant',
                }),
                articles = app.collections.get('article').where({
                    category_id: plantCategory.get('id'),
                }),
                cropArticleVarieties = task.find('crop').find('article').findAll('article_variety'),
                plantIds = _.map(cropArticleVarieties, function(cropArticleVariety) {
                    return cropArticleVariety.get('plant_id');
                }),
                articles = _.filter(articles, function (article) {
                    var articleVarieties = article.findAll('article_variety', {
                        plant_id: plantIds,
                    })
                    return articleVarieties.length > 0;
                });

            articles = _.sortBy(articles, function (article) {
                return article.getDisplayName();
            });
            _.each(articles, function(article) {
                var organization = article.find('organization');
                data.push({
                    optgroup: _.isNull(organization) ? entity.getDisplayName() : organization.getDisplayName(),
                    value: article.get('id'),
                    label: article.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        openArticleCreationDialog: function () {
            var dialog = app.dialogs.get('article'),
                taskId = this.getElement('task_id').getValue(),
                task = app.collections.get('task').get(taskId),
                plantCategory = app.collections.get('category').findRoot('article_category_id').findChild({
                    key: 'plant',
                }),
                quantityUnitRoot = app.collections.get('category').findRoot('article_quantity_unit_id'),
                quantityUnitUnit = quantityUnitRoot.findChild({key: 'unit'}),
                cropArticleVarieties = task.find('crop').find('article').findAll('article_variety');

            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.article').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                organization_id: app.modules.has('trade') ? undefined : null,
                category_id: plantCategory.get('id'),
                quantity_unit_id: quantityUnitUnit.get('id'),
                active: true,
            });
            dialog.form.setVisible({
                organization_id: app.modules.has('trade'),
            });
            dialog.form.setDisabled({
                category_id: true,
            });
            var articleVarietyForm = dialog.form.getArticleVarietyForm();
            articleVarietyForm.setData({
                entity_id: this.getElement('entity_id').getValue(),
                plant_id: cropArticleVarieties.length > 0 ? _.first(cropArticleVarieties).get('plant_id') : undefined,
                variety_id: null,
            });
            dialog.open().done(function (article) {
                var articleSelect = this.getElement('article_id');
                articleSelect.setValue(article.get('id'));
                articleSelect.render();
                $(articleSelect.el).trigger('change');
            }.bind(this));
        },

        buildVarietyData: function () {
            var articleId = this.getElement('article_id').getValue(),
                article = app.collections.get('article').get(articleId);

            if (!article) return [];

            var plantIds = _.map(article.findAll('article_variety'), function(articleVariety) {
                    return articleVariety.get('plant_id');
                }),
                data = [],
                varieties = app.collections.get('variety').where({
                    plant_id: plantIds,
                });

            varieties = _.sortBy(varieties, function (variety) {
                return variety.getDisplayName();
            });
            _.each(varieties, function(variety) {
                data.push({
                    value: variety.get('id'),
                    label: variety.getDisplayName(),
                });
            });
            return data;
        },

        resetVarietySelect: function () {
            var articleId = this.getElement('article_id').getValue(),
                article = app.collections.get('article').get(articleId),
                varietyFormGroup = this.getVarietyFormGroup(),
                varietySelect = this.getElement('variety_id');

            varietySelect.setNullable(false);
            varietySelect.setValue('');
            varietySelect.setVisible(true);
            $(varietyFormGroup.el).show();

            if (article && !_.isNull(article.get('organization_id'))) {
                var articleVarieties = article.findAll('article_variety');
                if (articleVarieties.length == 1) {
                    var varietyId = _.first(articleVarieties).get('variety_id');
                    varietySelect.setValue(varietyId);
                    varietySelect.setVisible(false);
                    $(varietyFormGroup.el).hide();
                }
                if (articleVarieties.length > 1) {
                    varietySelect.setNullable(true);
                    varietySelect.setValue(null);
                    varietySelect.setVisible(false);
                    $(varietyFormGroup.el).hide();
                }
            }

            varietySelect.render();
            $(varietySelect.el).trigger('change');
        },

        openVarietyCreationDialog: function () {
            var articleId = this.getElement('article_id').getValue(),
                article = app.collections.get('article').get(articleId),
                dialog = app.dialogs.get('variety');

            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.variety').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            var formData = {};
            if (article) {
                var plantIds = _.map(article.findAll('article_variety'), function(articleVariety) {
                    return articleVariety.get('plant_id');
                });
                formData.plant_id = _.first(plantIds);
            }
            dialog.form.setData($.extend(formData, {
                entity_id: this.getElement('entity_id').getValue(),
                active: true,
            }));
            dialog.form.setVisible({});
            dialog.form.setDisabled({
                active: true,
            });
            dialog.open().done(function (variety) {
                var varietySelect = this.getElement('variety_id');
                varietySelect.setValue(variety.get('id'));
                varietySelect.render();
                $(varietySelect.el).trigger('change');
            }.bind(this));
        },

        buildCategoryData: function () {
            var categories = app.collections.get('category').findRoot('planting_category_id').findChildren();
            return _.map(categories, function(category) {
                return {
                    value: category.get('id'),
                    label: category.getDisplayName(),
                };
            });
        },

        render: function() {
            Form.prototype.render.call(this);

            this.resetVarietySelect();
        },
    });
});