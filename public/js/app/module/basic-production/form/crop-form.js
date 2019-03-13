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
                collection: app.collections.get('crop'),
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
                                        change: this.buildNumberValue.bind(this),
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
                        new InputNumber({
                            name: 'number',
                            placeholder: polyglot.t('form.placeholder.serial_number'),
                            min: 1,
                            cast: 'integer',
                        }),
                    ],
                }),
            });
        },

        buildArticleData: function () {
            var data = [],
                articleId = this.getElement('article_id').getValue(),
                harvestCategory = this.getHarvestCategory();

            var articles = app.collections.get('article').where({
                organization_id: null,
                category_id: harvestCategory.get('id'),
                active: true,
            });
            if (articleId) {
                var article = app.collections.get('article').get(articleId);
                if (!_.contains(articles, article)) articles.push(article);
            }
            _.each(articles, function(article) {
                data.push({
                    optgroup: article.getDisplayName().charAt(0).removeDiacritics().toUpperCase(),
                    value: article.get('id'),
                    label: article.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        buildNumberValue: function () {
            var article_id = this.getElement('article_id').getValue();
            if (article_id) {
                var crops = app.collections.get('crop').where({
                    article_id: article_id,
                });
                var max = 0;
                _.each(crops, function(crop) {
                    max = Math.max(max, crop.get('number'));
                });
                this.getElement('number').setValue(max + 1);
            }
        },

        openArticleCreationDialog: function () {
            var dialog = app.dialogs.get('article'),
                harvestCategory = this.getHarvestCategory(),
                quantityUnitRoot = app.collections.get('category').findRoot('article_quantity_unit_id'),
                quantityUnitKg = quantityUnitRoot.findChild({key: 'kg'});

            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.article').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                organization_id: null,
                category_id: harvestCategory.get('id'),
                quantity_unit_id: quantityUnitKg.get('id'),
                active: true,
            });
            dialog.form.setVisible({
                organization_id: false,
            });
            dialog.form.setDisabled({
                category_id: true,
            });
            dialog.open().done(function (article) {
                var articleSelect = this.getElement('article_id');
                articleSelect.setValue(article.get('id'));
                articleSelect.render();
                $(articleSelect.el).trigger('change');
            }.bind(this));
        },

        getHarvestCategory: function () {
            var rootCategory = app.collections.get('category').findWhere({
                parent_id: null,
                key: 'article_category_id',
            });
            return app.collections.get('category').findWhere({
                parent_id: rootCategory.get('id'),
                key: 'harvest',
            });
        },
    });
});