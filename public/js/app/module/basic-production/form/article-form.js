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
            Form.prototype.initialize.call(this, {
                id: 'article-form',
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
                                    css: {flex: '1'},
                                    placeholder: polyglot.t('form.placeholder.unit_price'),
                                    min: 0,
                                    cast: 'float',
                                }),
                                new Select({
                                    name: 'default_tax',
                                    placeholder: polyglot.t('form.placeholder.tax'),
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
                                    cast: 'boolean',
                                }),
                             ],
                        }),
                    ],
                }),
            });
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

        buildQuantityUnitData: function () {
            var categories = app.collections.get('category').findRoot('article_quantity_unit_id').findChildren();
            return _.map(categories, function(category) {
                return {
                    value: category.get('id'),
                    label: category.getDisplayName(),
                };
            });
        },
    });
});