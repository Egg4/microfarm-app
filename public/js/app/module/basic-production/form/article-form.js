'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/form/element/input-text-form-element',
    'lib/widget/form/element/input-number-form-element',
    'lib/widget/form/element/checkbox-form-element',
    'lib/widget/form/label/form-label',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Form, FormGroup, InputHidden, Select, InputText, InputNumber, Checkbox, FormLabel, Button, Label, Icon) {

    return Form.extend({

        initialize: function () {
            this.subForms = [];

            Form.prototype.initialize.call(this, {
                collection: app.collections.get('article'),
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
                                    name: 'organization_id',
                                    placeholder: polyglot.t('form.placeholder.organization_id'),
                                    optgroup: true,
                                    nullable: true,
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildOrganizationData.bind(this),
                                    events: {
                                        change: function () {
                                            this.resetArticleVarietyForm();
                                            this.resetArticleName();
                                        }.bind(this),
                                    },
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openOrganizationCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                        new Select({
                            name: 'category_id',
                            placeholder: polyglot.t('form.placeholder.category_id'),
                            cast: 'integer',
                            data: this.buildCategoryData.bind(this),
                            events: {
                                change: function () {
                                    this.resetArticleVarietyForm();
                                    this.resetArticleName();
                                    this.resetQuantityUnitValue();
                                }.bind(this),
                            },
                        }),
                        new FormGroup({
                            className: 'article-variety-form-group',
                            items: this.buildArticleVarietyFormGroupItems(),
                        }),
                        new InputText({
                            name: 'name',
                            placeholder: polyglot.t('form.placeholder.name'),
                        }),
                        new Select({
                            name: 'quantity_unit_id',
                            placeholder: polyglot.t('form.placeholder.quantity_unit_id'),
                            cast: 'integer',
                            data: this.buildQuantityUnitData.bind(this),
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new InputNumber({
                                    name: 'default_unit_price',
                                    placeholder: polyglot.t('form.placeholder.unit_price'),
                                    min: 0,
                                    defaultValue: 0,
                                    defaultVisible: false,
                                    css: {flex: '1'},
                                    cast: 'float',
                                }),
                                new Select({
                                    name: 'default_tax',
                                    placeholder: polyglot.t('form.placeholder.tax'),
                                    defaultValue: 0,
                                    defaultVisible: false,
                                    css: {width: '8em'},
                                    cast: 'float',
                                    data: [
                                        {value: 0, label: '0%'},
                                        {value: 0.055, label: '5.5%'},
                                        {value: 0.100, label: '10%'},
                                        {value: 0.200, label: '20%'},
                                    ],
                                }),
                            ],
                        }),
                        new FormGroup({
                            items: [
                                new Checkbox({
                                    name: 'active',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.active'),
                                    }),
                                    defaultValue: true,
                                    defaultVisible: false,
                                    cast: 'boolean',
                                }),
                             ],
                        }),
                    ],
                }),
            });
        },

        getArticleVarietyFormGroup: function() {
            return this.formGroup.items[4];
        },

        getArticleVarietyForm: function() {
            var articleVarietyFormGroup = this.getArticleVarietyFormGroup();
            return articleVarietyFormGroup.items[0];
        },

        buildOrganizationData: function () {
            var data = [],
                entityId = app.authentication.get('entity_id'),
                entity = app.collections.get('entity').get(entityId),
                organizations = app.collections.get('organization').where({
                    supplier: true,
                });
            data.push({
                optgroup: entity.getDisplayName().charAt(0).removeDiacritics().toUpperCase(),
                value: null,
                label: entity.getDisplayName(),
            });
            _.each(organizations, function(organization) {
                data.push({
                    optgroup: organization.getDisplayName().charAt(0).removeDiacritics().toUpperCase(),
                    value: organization.get('id'),
                    label: organization.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        openOrganizationCreationDialog: function () {
            var dialog = app.dialogs.get('organization');

            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.organization').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                supplier: true,
                client: false,
            });
            dialog.form.setVisible({});
            dialog.form.setDisabled({
                supplier: true,
            });
            dialog.open().done(function (organization) {
                var organizationSelect = this.getElement('organization_id');
                organizationSelect.setValue(organization.get('id'));
                organizationSelect.render();
                $(organizationSelect.el).trigger('change');
            }.bind(this));
        },

        buildCategoryData: function () {
            var categories = app.collections.get('category').findRoot('article_category_id').findChildren();
            return _.map(categories, function(category) {
                return {
                    value: category.get('id'),
                    label: category.getDisplayName(),
                };
            });
        },

        buildArticleVarietyFormGroupItems: function () {
            var ArticleVarietyForm = app.modules.get('taxonomy').schemas.article_variety.form.class;
            return [
                new ArticleVarietyForm({tagName: 'div'}),
            ];
        },

        resetArticleVarietyForm: function () {
            var articleId = this.getElement('id').getValue(),
                organizationId = this.getElement('organization_id').getValue(),
                categoryId = this.getElement('category_id').getValue(),
                category = app.collections.get('category').get(categoryId),
                articleVarietyFormGroup = this.getArticleVarietyFormGroup(),
                articleVarietyForm = this.getArticleVarietyForm();

            if (articleId == 0 && category && _.contains(['seed', 'plant', 'harvest'], category.get('key'))) {

                var plantSelect = articleVarietyForm.getElement('plant_id'),
                    varietySelect = articleVarietyForm.getElement('variety_id');

                if (organizationId > 0) {
                    articleVarietyForm.setData($.extend(articleVarietyForm.getData(), {
                        variety_id: '',
                    }));
                    articleVarietyForm.setVisible({
                        variety_id: true,
                    });
                    articleVarietyForm.setDisabled({
                    });
                    varietySelect.setRequired(true);
                }
                else {
                    articleVarietyForm.setData($.extend(articleVarietyForm.getData(), {
                        variety_id: null,
                    }));
                    articleVarietyForm.setVisible({
                        variety_id: false,
                    });
                    articleVarietyForm.setDisabled({
                    });
                    varietySelect.setRequired(false);
                }
                articleVarietyForm.render();

                $(plantSelect.el).on('change', this.resetArticleName.bind(this));
                $(varietySelect.el).on('change', this.resetArticleName.bind(this));
                $(articleVarietyFormGroup.el).show();
            } else {
                $(articleVarietyFormGroup.el).hide();
            }
        },

        resetArticleName: function () {
            var categoryId = this.getElement('category_id').getValue(),
                category = app.collections.get('category').get(categoryId),
                articleVarietyForm = this.getArticleVarietyForm(),
                plantSelect = articleVarietyForm.getElement('plant_id'),
                varietySelect = articleVarietyForm.getElement('variety_id'),
                nameInput = this.getElement('name'),
                name = '';

            if (category && _.contains(['seed', 'plant', 'cart'], category.get('key'))) {
                name += category.get('value') + ' ';
            }
            if (category && _.contains(['seed', 'plant', 'harvest'], category.get('key'))) {
                var plantId = plantSelect.getValue(),
                    plant = app.collections.get('plant').get(plantId);
                if (plant) {
                    name += plant.get('name') + ' ';
                }
                var varietyId = varietySelect.getValue(),
                    variety = app.collections.get('variety').get(varietyId);
                if (variety) {
                    name += variety.get('name') + ' ';
                }
            }

            nameInput.setValue(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
            nameInput.render();
            $(nameInput.el).trigger('change');
        },

        buildQuantityUnitData: function () {
            var quantityUnits = app.collections.get('category').findRoot('article_quantity_unit_id').findChildren();
            return _.map(quantityUnits, function(quantityUnit) {
                return {
                    value: quantityUnit.get('id'),
                    label: quantityUnit.getDisplayName(),
                };
            });
        },

        resetQuantityUnitValue: function () {
            var categoryId = this.getElement('category_id').getValue(),
                category = app.collections.get('category').get(categoryId),
                quantityUnitRoot = app.collections.get('category').findRoot('article_quantity_unit_id'),
                quantityUnitSelect = this.getElement('quantity_unit_id'),
                keyMap = {
                    seed: 'g',
                    plant: 'unit',
                    harvest: 'kg',
                    input: 'kg',
                    tool: 'unit',
                    installation: 'unit',
                    cart: 'unit',
                };

            var quantityUnit = quantityUnitRoot.findChild({
                key: keyMap[category.get('key')],
            });
            quantityUnitSelect.setValue(quantityUnit.get('id'));
            quantityUnitSelect.render();
            $(quantityUnitSelect.el).trigger('change');
        },

        setData: function(data) {
            Form.prototype.setData.call(this, data);

            var articleVarietyForm = this.getArticleVarietyForm();
            articleVarietyForm.setData();
        },

        setVisible: function(visible) {
            Form.prototype.setVisible.call(this, visible);

            var articleVarietyForm = this.getArticleVarietyForm();
            articleVarietyForm.setVisible();
        },

        setDisabled: function(disabled) {
            Form.prototype.setDisabled.call(this, disabled);

            var articleVarietyForm = this.getArticleVarietyForm();
            articleVarietyForm.setDisabled();
        },

        render: function() {
            Form.prototype.render.call(this);

            this.resetArticleVarietyForm();
        },

        submit: function() {
            var articleId = this.getElement('id').getValue(),
                categoryId = this.getElement('category_id').getValue(),
                category = app.collections.get('category').get(categoryId);

            if (articleId == 0 && category && _.contains(['seed', 'plant', 'harvest'], category.get('key'))) {
                return this.submitArticleAndArticleVariety();
            }
            else {
                return this.submitArticleOnly();
            }
        },

        submitArticleOnly: function() {
            return Form.prototype.submit.call(this);
        },

        submitArticleAndArticleVariety: function() {
            var deferred = $.Deferred(),
                articleVarietyForm = this.getArticleVarietyForm();

            articleVarietyForm.setData($.extend(articleVarietyForm.getData(), {
                entity_id: this.getElement('entity_id').getValue(),
                article_id: 0, // Validator bypass
            }));

            if (!this.validate()) return deferred.reject();
            if (!articleVarietyForm.validate()) return deferred.reject();

            Form.prototype.submit.call(this)
                .done(function(data) {
                    articleVarietyForm.setData($.extend(articleVarietyForm.getData(), {
                        article_id: data.id,
                    }));
                    articleVarietyForm.submit()
                        .done(function() {
                            deferred.resolve(data);
                        })
                        .fail(function() {
                            deferred.reject();
                        });
                }.bind(this))
                .fail(function() {
                    deferred.reject();
                });

            return deferred.promise();
        },
    });
});