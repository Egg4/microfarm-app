'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'factory/form-factory',
    'factory/model-table-factory',
], function ($, _, Page, Body, HeaderFactory, FormFactory, ModelTableFactory) {

    return Page.extend({

        initialize: function () {
            var searchForm = FormFactory.create('search', {modelName: 'product'});

            Page.prototype.initialize.call(this, {
                id: 'products-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-database"></i> Products',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        productTable: this.createProductTable(searchForm),
                    },
                }),
            });

            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createProductTable: function (searchForm) {
            return ModelTableFactory.create('product', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (garden) {
                    return _.sortBy(garden.findAll('product'), function (product) {
                        return (product.get('name') + product.find('provider').get('name')).removeDiacritics().toLowerCase();
                    });
                },
                rowTemplate: _.template($('#products-page-product-table-row-template').html()),
                rowData: function (product) {
                    var flows = product.findAll('flow');
                    var stock = 0;
                    _.each(flows, function (flow) {
                        stock += parseFloat(flow.get('quantity')) * (flow.get('type') == 'output' ? 1 : -1);
                    });
                    return $.extend(product.toJSON(), {
                        provider: product.find('provider').toJSON(),
                        category: product.find('category').toJSON(),
                        stock: stock,
                        inputNum: product.findAll('flow', {filter: {type: 'input'}}).length,
                        outputNum: product.findAll('flow', {filter: {type: 'output'}}).length,
                    });
                },
                listenToCollections: ['product', 'provider', 'flow'],
                formData: function (garden) {
                    return {
                        garden_id: garden.get('id'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                    };
                },
            });
        },

        render: function (options) {
            this.garden = options.garden;

            Page.prototype.render.call(this, options);

            this.header.items.searchForm.render();
            this.body.items.productTable.render({
                parentModel: this.garden,
            });
        },
    });
});