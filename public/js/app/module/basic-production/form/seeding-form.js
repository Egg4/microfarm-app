'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/form/element/input-number-form-element',
    'lib/widget/form/element/checkbox-form-element',
    'lib/widget/form/label/form-label',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Form, FormGroup, InputHidden, Select, InputNumber, Checkbox, FormLabel, Button, Label, Icon) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                id: 'seeding-form',
                collection: app.collections.get('seeding'),
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
                                        change: function () {
                                            this.getElement('variety_id').render();
                                        }.bind(this),
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
                        new FormGroup({
                            items: [
                                new Checkbox({
                                    name: 'nursery',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.nursery'),
                                    }),
                                    cast: 'boolean',
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
                                    name: 'density',
                                    placeholder: polyglot.t('form.placeholder.density'),
                                    min: 0,
                                    cast: 'float',
                                    css: {flex: '1'},
                                }),
                                new Select({
                                    name: 'density_unit_id',
                                    placeholder: polyglot.t('form.placeholder.density_unit_id'),
                                    cast: 'integer',
                                    css: {width: '10em'},
                                    data: this.buildDensityUnitData.bind(this),
                                }),
                            ],
                        }),new FormGroup({
                            type: 'horizontal',
                            items: [
                                new InputNumber({
                                    name: 'area',
                                    placeholder: polyglot.t('form.placeholder.area'),
                                    min: 0,
                                    cast: 'float',
                                    css: {flex: '1'},
                                }),
                                new Select({
                                    name: 'area_unit_id',
                                    placeholder: polyglot.t('form.placeholder.area_unit_id'),
                                    cast: 'integer',
                                    css: {width: '10em'},
                                    data: this.buildAreaUnitData.bind(this),
                                }),
                            ],
                        }),
                    ],
                }),
            });
        },

        buildArticleData: function () {
            var data = [],
                taskId = this.getElement('task_id').getValue(),
                task = app.collections.get('task').get(taskId),
                categories = app.collections.get('category').findRoot('article_category_id').findChildren({
                    key: 'seed',
                }),
                articles = app.collections.get('article').where({
                    category_id: _.map(categories, function(category) {
                        return category.get('id');
                    }),
                    active: true,
                }),
                articleId = this.getElement('article_id').getValue();
            if (app.modules.has('taxonomy')) {
                var cropArticleVarieties = task.find('crop').find('article').findAll('article_variety');
                var plantIds = _.map(cropArticleVarieties, function(cropArticleVariety) {
                    return cropArticleVariety.get('plant_id');
                });
                articles = _.filter(articles, function (article) {
                    var articleVarieties = article.findAll('article_variety', {
                        plant_id: plantIds,
                    })
                    return articleVarieties.length > 0;
                });
            }
            if (articleId) {
                var article = app.collections.get('article').get(articleId);
                if (!_.contains(articles, article)) articles.push(article);
            }
            articles = _.sortBy(articles, function (article) {
                return article.getDisplayName();
            });
            _.each(articles, function(article) {
                var organization = article.find('organization');
                data.push({
                    optgroup: _.isNull(organization) ? '-' : organization.getDisplayName(),
                    value: article.get('id'),
                    label: article.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        openArticleCreationDialog: function () {
            var dialog = app.dialogs.get('article');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.article').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                organization_id: null,
                active: true,
            });
            dialog.form.setVisible({
                organization_id: false,
                category_id: true,
                name: true,
                quantity_unit_id: true,
                default_unit_price: true,
                default_tax: true,
                active: false,
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
                data = [{
                    value: null,
                    label: polyglot.t('model.field.variety_id.null'),
                }],
                varieties = app.collections.get('variety').where({
                    plant_id: plantIds,
                    active: true,
                }),
                varietyId = this.getElement('variety_id').getValue();
            if (varietyId) {
                var variety = app.collections.get('variety').get(varietyId);
                if (!_.contains(varieties, variety)) varieties.push(variety);
            }
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

        openVarietyCreationDialog: function () {
            var dialog = app.dialogs.get('variety');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.variety').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                active: true,
            });
            dialog.form.setVisible({
                plant_id: true,
                name: true,
                active: false,
            });
            dialog.open().done(function (variety) {
                var varietySelect = this.getElement('variety_id');
                varietySelect.setValue(variety.get('id'));
                varietySelect.render();
                $(varietySelect.el).trigger('change');
            }.bind(this));
        },

        buildCategoryData: function () {
            var categories = app.collections.get('category').findRoot('seeding_category_id').findChildren();
            return _.map(categories, function(category) {
                return {
                    value: category.get('id'),
                    label: category.getDisplayName(),
                };
            });
        },

        buildDensityUnitData: function () {
            var categories = app.collections.get('category').findRoot('seeding_density_unit_id').findChildren();
            return _.map(categories, function(category) {
                return {
                    value: category.get('id'),
                    label: category.getDisplayName(),
                };
            });
        },

        buildAreaUnitData: function () {
            var categories = app.collections.get('category').findRoot('seeding_area_unit_id').findChildren();
            return _.map(categories, function(category) {
                return {
                    value: category.get('id'),
                    label: category.getDisplayName(),
                };
            });
        },
    });
});