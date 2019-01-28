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
                id: 'output-form',
                collection: app.collections.get('output'),
                formGroup: new FormGroup({
                    items: [
                        new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        new InputHidden({
                            name: 'entity_id',
                        }),
                        new InputHidden({
                            name: 'task_id',
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
                                            this.formGroup.items[5].items[1].render();
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
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'variety_id',
                                    placeholder: polyglot.t('form.placeholder.variety_id'),
                                    optgroup: true,
                                    nullable: true,
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
                            type: 'horizontal',
                            items: [
                                new InputNumber({
                                    name: 'quantity',
                                    placeholder: polyglot.t('form.placeholder.quantity'),
                                    min: 0,
                                    cast: 'float',
                                    css: {flex: '1'},
                                }),
                                new Button({
                                    css: {width: '6em'},
                                    label: new Label({
                                        text: this.buildQuantityButtonText.bind(this),
                                    }),
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
                cropArticle = task.find('crop').find('article');

            var categories = app.collections.get('category').findRoot('article_category_id').findChildren({
                key: ['seed', 'plant', 'harvest'],
            });
            var articles = app.collections.get('article').where({
                organization_id: null,
                category_id: _.map(categories, function(category) {
                    return category.get('id');
                }),
                active: true,
            });
            if (app.modules.has('taxonomy')) {
                var cropArticleVarieties = cropArticle.findAll('article_variety');
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
            if (!_.contains(articles, cropArticle)) {
                articles.push(cropArticle);
            }
            articles = _.sortBy(articles, function (article) {
                return article.getDisplayName();
            });
            _.each(articles, function(article) {
                data.push({
                    optgroup: article.find('category').getDisplayName(),
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
                article = app.collections.get('article').get(articleId),
                plantIds = _.map(article.findAll('article_variety'), function(articleVariety) {
                    return articleVariety.get('plant_id');
                }),
                varietyId = this.getElement('variety_id').getValue(),
                data = [{
                    optgroup: '-',
                    value: null,
                    label: polyglot.t('model.field.variety_id.null'),
                }],
                varieties = app.collections.get('variety').where({
                    plant_id: plantIds,
                    active: true,
                });
            if (varietyId) {
                var variety = app.collections.get('variety').get(varietyId);
                if (!_.contains(varieties, variety)) varieties.push(variety);
            }
            varieties = _.sortBy(varieties, function (variety) {
                return variety.getDisplayName();
            });
            _.each(varieties, function(variety) {
                data.push({
                    optgroup: variety.get('name').charAt(0).removeDiacritics().toUpperCase(),
                    value: variety.get('id'),
                    label: variety.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
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

        buildQuantityButtonText: function () {
            var articleId = this.getElement('article_id').getValue(),
                article = app.collections.get('article').get(articleId),
                quantityUnit = article.find('category', {selfAttribute: 'quantity_unit_id'});
            return quantityUnit.get('value');
        },
    });
});