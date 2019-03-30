'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Form, FormGroup, InputHidden, Select, Button, Label, Icon) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                collection: app.collections.get('tooling'),
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
                    ],
                }),
            });
        },

        buildArticleData: function () {
            var data = [],
                entityId = app.authentication.get('entity_id'),
                entity = app.collections.get('entity').get(entityId),
                taskId = this.getElement('task_id').getValue(),
                task = app.collections.get('task').get(taskId),
                toolCategory = app.collections.get('category').findRoot('article_category_id').findChild({
                    key: 'tool',
                }),
                articles = app.collections.get('article').where({
                    category_id: toolCategory.get('id'),
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
                toolCategory = app.collections.get('category').findRoot('article_category_id').findChild({
                    key: 'tool',
                }),
                quantityUnitRoot = app.collections.get('category').findRoot('article_quantity_unit_id'),
                quantityUnitUnit = quantityUnitRoot.findChild({key: 'unit'});

            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.article').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                organization_id: app.modules.has('trade') ? undefined : null,
                category_id: toolCategory.get('id'),
                quantity_unit_id: quantityUnitUnit.get('id'),
                active: true,
            });
            dialog.form.setVisible({
                organization_id: app.modules.has('trade'),
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
    });
});