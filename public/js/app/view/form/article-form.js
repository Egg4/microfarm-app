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
], function ($, _, Form, FormGroup, InputHidden, Select, InputText, InputNumber, Checkbox, FormLabel) {

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
                        }),
                        new InputHidden({
                            name: 'entity_id',
                        }),
                        new Select({
                            name: 'organization_id',
                            defaultValue: 0,
                            optgroup: true,
                            nullable: true,
                            cast: 'integer',
                            data: this.buildOrganizationData.bind(this),
                            validator: function (value) {
                                if (!_.isNull(value) && value <= 0) {
                                    return 'Invalid';
                                }
                            },
                        }),
                        new Select({
                            name: 'category_id',
                            cast: 'integer',
                            data: this.buildCategoryData.bind(this),
                        }),
                        new InputText({
                            name: 'name',
                            placeholder: polyglot.t('form.placeholder.name'),
                        }),
                        new Select({
                            name: 'quantity_unit_id',
                            cast: 'integer',
                            data: this.buildQuantityUnitData.bind(this),
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new InputNumber({
                                    name: 'default_unit_price',
                                    css: {flex: '1'},
                                    placeholder: polyglot.t('form.placeholder.unit-price'),
                                    min: 0,
                                    cast: 'float',
                                }),
                                new Select({
                                    name: 'default_tax',
                                    defaultValue: 0,
                                    css: {width: '6em'},
                                    cast: 'float',
                                    data: [
                                        {value: 0, label: '0%'},
                                        {value: 0.055, label: '5.5%'},
                                        {value: 0.1, label: '10%'},
                                        {value: 0.2, label: '20%'},
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
            var entity = app.collections.get('entity').at(0);
            var data = [{
                optgroup: '-',
                value: null,
                label: entity.getDisplayName(),
            }];
            var organizations = app.collections.get('organization').where({
                supplier: true,
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

        buildCategoryData: function () {
            var data = [];
            var rootCategory = _.first(app.collections.get('category').where({
                parent_id: null,
                key: 'article_category_id',
            }));
            _.each(rootCategory.findAll('category', {
                refAttribute: 'parent_id',
            }), function(category) {
                data.push({
                    value: category.get('id'),
                    label: category.getDisplayName(),
                });
            });
            return data;
        },

        buildQuantityUnitData: function () {
            var data = [];
            var rootCategory = _.first(app.collections.get('category').where({
                parent_id: null,
                key: 'article_quantity_unit_id',
            }));
            _.each(rootCategory.findAll('category', {
                refAttribute: 'parent_id',
            }), function(category) {
                data.push({
                    value: category.get('id'),
                    label: category.getDisplayName(),
                });
            });
            return data;
        },
    });
});