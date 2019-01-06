'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/input-text-form-element',
    'view/widget/form/element/input-number-form-element',
    'view/widget/form/element/input-date-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/button/button',
], function ($, _, Form, FormGroup, InputHidden, InputText, InputNumber, InputDate, Select, Button) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'flow-form',
                collection: app.collections.get('flow'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        task_id: new Select({
                            name: 'task_id',
                            optgroup: true,
                            data: this.getTaskData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid task';
                                }
                            },
                            events: {
                                change: this.onTaskChange.bind(this),
                            },
                        }),
                        product_id: new Select({
                            name: 'product_id',
                            optgroup: true,
                            data: this.getProductData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid product';
                                }
                            },
                            events: {
                                change: this.onProductChange.bind(this),
                            },
                        }),
                        flow_id: new Select({
                            name: 'flow_id',
                            nullable: true,
                            data: this.getFlowData.bind(this),
                            validator: function (value) {
                                if (this.getElement('type').getValue() == 'input' && value == null) {
                                    return 'Invalid flow';
                                }
                            }.bind(this),
                        }),
                        type: new Select({
                            name: 'type',
                            defaultValue: 'input',
                            data: [
                                {value: 'input', label: 'Input'},
                                {value: 'output', label: 'Output'},
                            ],
                        }),
                        date: new InputDate({
                            name: 'date',
                            placeholder: 'Date',
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid date';
                                }
                            },
                        }),
                        lot_line: new FormGroup({
                            type: 'horizontal',
                            items: {
                                lot: new InputText({
                                    name: 'lot',
                                    css: {flex: '1'},
                                    placeholder: 'Lot number',
                                    validator: function (value) {
                                        if (this.getElement('type').getValue() == 'output') {
                                            if (value.length == 0) {
                                                return 'Invalid lot number';
                                            }
                                        }
                                    }.bind(this),
                                }),
                                generate_lot: new Button({
                                    text: ' ',
                                    css: {width: '2.5em'},
                                    icon: 'star',
                                    events: {
                                        click: this.onGenerateLot.bind(this),
                                    },
                                }),
                            },
                        }),
                        quantity_line: new FormGroup({
                            type: 'horizontal',
                            items: {
                                quantity: new InputNumber({
                                    name: 'quantity',
                                    css: {flex: '1'},
                                    placeholder: 'Quantity',
                                    min: 0,
                                    validator: function (value) {
                                        if (value.length == 0 || parseFloat(value) <= 0) {
                                            return 'Invalid quantity';
                                        }
                                        if (this.getElement('type').getValue() == 'input') {
                                            var id = this.getElement('id').getValue();
                                            var flow_id = this.getElement('flow_id').getValue();
                                            var output = app.collections.get('flow').get(flow_id);
                                            if (output) {
                                                var inputs = _.reject(output.findAll('flow'), function (flow) { return flow.get('id') == id; });
                                                var inputQuantity = 0;
                                                _.each(inputs, function (input) {
                                                    inputQuantity += parseFloat(input.get('quantity'));
                                                });
                                                var quantity = output.get('quantity') - inputQuantity;
                                                if (value > quantity) {
                                                    return 'Invalid quantity (>' + quantity + ')';
                                                }
                                            }
                                        }
                                    }.bind(this),
                                }),
                                unit: new Button({
                                    text: '',
                                    css: {width: '4em'},
                                }),
                            },
                        }),
                    },
                }),
            }, options));
        },

        getTaskData: function () {
            var data = [];
            app.collections.get('task').each(function (task) {
                var optgroup = '';
                var provider = task.find('provider');
                if (provider) {
                    optgroup = provider.getDisplayName();
                }
                var crop = task.find('crop');
                if (crop) {
                    optgroup = crop.getDisplayName();
                }
                var pos = task.find('pos');
                if (pos) {
                    optgroup = pos.getDisplayName();
                }
                data.push({
                    optgroup: optgroup,
                    value: task.get('id'),
                    label: task.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        getProductData: function () {
            var data = [];
            var task_id = this.getElement('task_id').getValue();
            var products = [];
            if (parseInt(task_id) > 0) {
                var task = app.collections.get('task').get(task_id);
                var provider = task.find('provider');
                if (provider !== null) {
                    products = provider.findAll('product');
                }
                else {
                    products = app.collections.get('product').toArray();
                }
            }
            _.each(products, function (product) {
                var category = product.find('category');
                data.push({
                    optgroup: product.find('provider').getDisplayName(),
                    value: product.get('id'),
                    label: category.get('name') + ' ' + product.get('name'),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        getFlowData: function () {
            var data = [];
            var id = this.getElement('id').getValue();
            var product_id = this.getElement('product_id').getValue();
            var outputs = app.collections.get('flow').where({
                product_id: product_id,
                type: 'output',
            });
            _.each(outputs, function (output) {
                var inputs = _.reject(output.findAll('flow'), function (flow) { return flow.get('id') == id; });
                var inputQuantity = 0;
                _.each(inputs, function (input) {
                    inputQuantity += parseFloat(input.get('quantity'));
                });
                var quantity = output.get('quantity') - inputQuantity;
                if (quantity > 0) {
                    data.push({
                        value: output.get('id'),
                        label: output.get('lot') + ' (' + quantity + ' ' + output.find('product').get('quantity_unit') + ')',
                    });
                }
            });
            return data;
        },

        onTaskChange: function () {
            this.renderProductSelect();
        },

        onProductChange: function () {
            this.renderFlowSelect();
            this.renderQuantityLineUnitButton();
        },

        onGenerateLot: function () {
            if (this.getElement('lot').getValue().length == 0) {
                this.getElement('lot').setValue(String.random(8));
            }
        },

        render: function (options) {
            Form.prototype.render.call(this, options);

            this.renderLotLine();
            this.renderQuantityLineUnitButton();
        },

        renderProductSelect: function () {
            this.getElement('product_id').setValue('');
            this.getElement('product_id').render();
        },

        renderFlowSelect: function () {
            this.getElement('flow_id').setValue('');
            this.getElement('flow_id').render();
        },

        renderLotLine: function () {
            if (this.getElement('lot').isVisible()) {
                $(this.formGroup.items.lot_line.el).show();
            }
            else {
                $(this.formGroup.items.lot_line.el).hide();
            }
        },

        renderQuantityLineUnitButton: function () {
            var product_id = this.getElement('product_id').getValue();
            var product = app.collections.get('product').get(product_id);
            this.formGroup.items.quantity_line.items.unit.render({
                text: product ? product.get('quantity_unit') : ' ',
            });
        },

        validate: function (data) {
            var errors = [];
            if (!this.collection.checksUniqueKey(data, ['product_id', 'task_id', 'flow_id', 'type', 'date', 'lot'])) {
                errors.push({
                    attributes: ['product_id', 'task_id', 'flow_id', 'type', 'date', 'lot'],
                    message: 'This flow already exists',
                });
            }
            return errors;
        },
    });
});