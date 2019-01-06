'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'view/widget/navigation/breadcrumb-navigation',
    'factory/model-table-factory',
], function ($, _, Page, Body, HeaderFactory, Breadcrumb, ModelTableFactory) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'product-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-database"></i> Product',
                    items: {
                        productNavigation: this.createProductBreadcrumb(),
                        varietyProductNavigation: this.createVarietyProductBreadcrumb(),
                    },
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#product-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        inputTable: this.createInputTable(),
                        outputTable: this.createOutputTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('product'), 'update', this.render);
            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createProductBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    products: {
                        text: function(product) { return 'Products' },
                        click: function(product) { return app.router.navigate('products'); },
                    },
                    provider: {
                        text: function(product) { return 'Provider'; },
                        click: function(product) { return app.router.navigate('provider/' + product.get('provider_id')); },
                    },
                }],
            });
        },

        createVarietyProductBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    products: {
                        text: function(product) { return 'Products' },
                        click: function(product) { return app.router.navigate('products'); },
                    },
                    provider: {
                        text: function(product) { return 'Provider'; },
                        click: function(product) { return app.router.navigate('provider/' + product.get('provider_id')); },
                    },
                    variety: {
                        text: function(product) { return 'Variety'; },
                        click: function(product) { return app.router.navigate('variety/' + product.get('variety_id')); },
                    },
                }],
            });
        },

        createInputTable: function () {
            return ModelTableFactory.create('flow', {
                title: '<i class="fa fa-sign-in"></i> Inputs',
                tableData: function (product) {
                    return product.findAll('flow', {filter: {type: 'input'}});
                },
                rowTemplate: _.template($('#product-page-input-table-row-template').html()),
                rowData: this.flowTableRowData.bind(this),
                listenToCollections: ['flow', 'product', 'task'],
                formData: function (product) {
                    return {
                        garden_id: product.get('garden_id'),
                        product_id: product.get('id'),
                        type: 'input',
                        lot: '',
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        product_id: false,
                        type: false,
                        lot: false,
                    };
                },
            });
        },

        createOutputTable: function () {
            return ModelTableFactory.create('flow', {
                title: '<i class="fa fa-sign-out"></i> Outputs',
                tableData: function (product) {
                    return product.findAll('flow', {filter: {type: 'output'}});
                },
                rowTemplate: _.template($('#product-page-output-table-row-template').html()),
                rowData: this.flowTableRowData.bind(this),
                listenToCollections: ['flow', 'product', 'task'],
                formData: function (product) {
                    return {
                        garden_id: product.get('garden_id'),
                        product_id: product.get('id'),
                        flow_id: null,
                        type: 'output',
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        product_id: false,
                        flow_id: false,
                        type: false,
                    };
                },
            });
        },

        flowTableRowData: function (flow) {
            var product = flow.find('product');
            var task = flow.find('task');
            var provider = task.find('provider');
            var crop = task.find('crop');
            if (crop) {
                var variety = crop.find('variety');
            }
            var pos = task.find('pos');
            var category = task.find('category');
            var output = flow.find('flow');
            return $.extend(flow.toJSON(), {
                product: product.toJSON(),
                task: task.toJSON(),
                provider: provider ? provider.toJSON() : null,
                crop: crop ? crop.toJSON() : null,
                variety: crop ? variety.toJSON() : null,
                pos: pos ? pos.toJSON() : null,
                category: category.toJSON(),
                flow: output ? output.toJSON() : null,
            });
        },

        render: function (options) {
            options = options || {};
            this.product = options.product || this.product;
            var category = this.product.find('category');
            var provider = this.product.find('provider');
            var variety = this.product.find('variety');
            if (variety) {
                var species = variety.find('species');
            }

            Page.prototype.render.call(this, options);

            this.header.render();
            _.each(this.header.items, function (navigation) {
                navigation.$el.hide(0);
            }.bind(this));
            if (!variety) {
                this.header.items.productNavigation.render({
                    model: this.product,
                });
                this.header.items.productNavigation.$el.show(0);
            } else {
                this.header.items.varietyProductNavigation.render({
                    model: this.product,
                });
                this.header.items.varietyProductNavigation.$el.show(0);
            }
            this.body.items.modelBody.render($.extend(this.product.toJSON(), {
                category: category.toJSON(),
                provider: provider.toJSON(),
                variety: variety ? variety.toJSON() : null,
                species : variety ? species.toJSON() : null,
            }));
            this.body.items.inputTable.render({
                parentModel: this.product,
            });
            this.body.items.outputTable.render({
                parentModel: this.product,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('product').show({
                title: 'Edit ' + this.product.getDisplayName(),
                form: {
                    data: this.product.toJSON(),
                    visibility: {
                        garden_id: false,
                        provider_id: false,
                    },
                },
            });
        },
    });
});