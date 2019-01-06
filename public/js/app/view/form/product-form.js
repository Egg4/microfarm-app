'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-text-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputText) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'product-form',
                collection: app.collections.get('product'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        provider_id: new Select({
                            name: 'provider_id',
                            data: this.getProviderData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid provider';
                                }
                            },
                        }),
                        category_id: new Select({
                            name: 'category_id',
                            optgroup: true,
                            data: this.getCategoryData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid category';
                                }
                            },
                        }),
                        variety_id: new Select({
                            name: 'variety_id',
                            nullable: true,
                            optgroup: true,
                            data: this.getVarietyData.bind(this),
                        }),
                        reference: new InputText({
                            name: 'reference',
                            placeholder: 'Reference',
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid reference';
                                }
                            },
                        }),
                        name: new InputText({
                            name: 'name',
                            placeholder: 'Name',
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid name';
                                }
                            },
                        }),
                        quantity_unit: new Select({
                            name: 'quantity_unit',
                            defaultValue: 'unit',
                            data: [
                                {value: 'unit', label: 'Unit'},
                                {value: 'g', label: 'g'},
                                {value: 'kg', label: 'kg'},
                            ],
                        }),
                    },
                }),
            }, options));
        },

        getProviderData: function () {
            var data = [];
            app.collections.get('provider').each(function(provider) {
                data.push({
                    value: provider.get('id'),
                    label: provider.getDisplayName(),
                });
            });
            return data;
        },

        getCategoryData: function () {
            var data = [];
            var categories = app.collections.get('category').where({
                model: 'product',
            });
            _.each(categories, function(category) {
                data.push({
                    optgroup: category.get('group'),
                    value: category.get('id'),
                    label: category.getDisplayName(),
                });
            });
            return _.groupBy(data, 'optgroup');
        },

        getVarietyData: function () {
            var data = [{
                optgroup: '-',
                value: '',
                label: 'None',
            }];
            app.collections.get('variety').each(function(variety) {
                var species = variety.find('species');
                var genus = species.find('genus');
                var family = genus.find('family');
                data.push({
                    optgroup: family.getDisplayName() + ' ' + genus.getDisplayName() + ' ' + species.getDisplayName(),
                    value: variety.get('id'),
                    label: variety.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        validate: function (data) {
            var errors = [];
            if (!this.collection.checksUniqueKey(data, ['provider_id', 'category_id', 'name'])) {
                errors.push({
                    attributes: ['provider_id', 'category_id', 'name'],
                    message: 'This product already exists',
                });
            }
            return errors;
        },
    });
});