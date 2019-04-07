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
                collection: app.collections.get('output'),
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
                            name: 'task_id',
                            placeholder: polyglot.t('form.placeholder.task_id'),
                            optgroup: true,
                            cast: 'integer',
                            data: this.buildTaskData.bind(this),
                            events: {
                                change: this.resetArticleSelect.bind(this),
                            },
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'article_id',
                                    placeholder: polyglot.t('form.placeholder.article_id'),
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildArticleData.bind(this),
                                    events: {
                                        change: function () {
                                            this.resetVarietySelect();
                                            this.resetQuantityButton();
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
                                    validator: function (value) {
                                        if (_.isNaN(value) || value <= 0) {
                                            return polyglot.t('form.validator.greater', {
                                                field: polyglot.t('form.field.quantity'),
                                                value: 0,
                                            });
                                        }
                                    },
                                }),
                                new Button({
                                    css: {width: '8em'},
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

        buildTaskData: function () {
            var data = [];
            var categories = app.collections.get('category').findRoot('task_category_id').findChild({
                key: 'production',
            }).findChild({
                key: 'primary',
            }).findChildren({
                key: ['harvest', 'harvest_plant', 'harvest_seed'],
            });
            var tasks = app.collections.get('task').where({
                category_id: _.map(categories, function(category) {
                    return category.get('id');
                }),
            });
            tasks = _.sortBy(tasks, function (task) {
                return task.getDisplayName();
            });
            _.each(tasks, function(task) {
                var crop = task.find('crop'),
                    article = crop.find('article'),
                    category = task.find('category'),
                    date = task.get('date'),
                    day = date.dateFormat('d'),
                    month = polyglot.t('date.month.' + date.dateFormat('M').toLowerCase()),
                    time = task.get('time').substring(0, 5);
                data.push({
                    optgroup: article.getDisplayName(),
                    value: task.get('id'),
                    label: day + ' ' + month + ' ' + time + ' - '  + crop.getDisplayName() + ' - ' + category.get('value'),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        buildArticleData: function () {
            var data = [],
                taskId = this.getElement('task_id').getValue(),
                task = app.collections.get('task').get(taskId);

            if (!task) return [];

            var keyMap = {
                    harvest: 'harvest',
                    harvest_plant: 'plant',
                    harvest_seed: 'seed',
                },
                category = app.collections.get('category').findRoot('article_category_id').findChild({
                    key: keyMap[task.find('category').get('key')],
                }),
                articles = app.collections.get('article').where({
                    organization_id: null,
                    category_id: category.get('id'),
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
                data.push({
                    value: article.get('id'),
                    label: article.getDisplayName(),
                });
            });
            return data;
        },

        resetArticleSelect: function () {
            var articleSelect = this.getElement('article_id');

            articleSelect.render();
            $(articleSelect.el).trigger('change');
        },

        openArticleCreationDialog: function () {
            var dialog = app.dialogs.get('article'),
                taskId = this.getElement('task_id').getValue(),
                task = app.collections.get('task').get(taskId),
                keyMap = {
                    harvest: 'harvest',
                    harvest_plant: 'plant',
                    harvest_seed: 'seed',
                };
            if (task) {
                var category = app.collections.get('category').findRoot('article_category_id').findChild({
                        key: keyMap[task.find('category').get('key')],
                    }),
                    quantityUnitRoot = app.collections.get('category').findRoot('article_quantity_unit_id'),
                    quantityUnitKg = quantityUnitRoot.findChild({key: 'kg'}),
                    cropArticleVarieties = task.find('crop').find('article').findAll('article_variety');
            }
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.article').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                organization_id: null,
                category_id: task ? category.get('id') : undefined,
                quantity_unit_id: task ? quantityUnitKg.get('id') : undefined,
                active: true,
            });
            dialog.form.setVisible({
                organization_id: false,
            });
            dialog.form.setDisabled({
                category_id: (task),
            });
            var articleVarietyForm = dialog.form.getArticleVarietyForm();
            articleVarietyForm.setData({
                entity_id: this.getElement('entity_id').getValue(),
                plant_id: task && cropArticleVarieties.length > 0 ? _.first(cropArticleVarieties).get('plant_id') : undefined,
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
                data = [{
                    value: null,
                    label: polyglot.t('model.field.variety_id.null'),
                }],
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
            var varietySelect = this.getElement('variety_id');

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

        getQuantityButton: function () {
            return this.formGroup.items[5].items[1];
        },

        buildQuantityButtonText: function () {
            var articleId = this.getElement('article_id').getValue(),
                article = app.collections.get('article').get(articleId);

            if (!article) return '';

            var quantityUnit = article.find('category', {selfAttribute: 'quantity_unit_id'});
            return quantityUnit.get('value');
        },

        resetQuantityButton: function () {
            var quantityButton = this.getQuantityButton();
            quantityButton.render();
        },
    });
});