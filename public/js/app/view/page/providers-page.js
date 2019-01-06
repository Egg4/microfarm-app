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
            var searchForm = FormFactory.create('search', {modelName: 'provider'});

            Page.prototype.initialize.call(this, {
                id: 'providers-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-copyright"></i> Providers',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        providerTable: this.createProviderTable(searchForm),
                    },
                }),
            });

            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createProviderTable: function (searchForm) {
            return ModelTableFactory.create('provider', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (garden) {
                    return garden.findAll('provider');
                },
                rowTemplate: _.template($('#providers-page-provider-table-row-template').html()),
                rowData: function (provider) {
                    return $.extend(provider.toJSON(), {
                        productNum: provider.findAll('product').length,
                        taskNum: provider.findAll('task').length,
                    });
                },
                listenToCollections: ['provider', 'product'],
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
            this.body.items.providerTable.render({
                parentModel: this.garden,
            });
        },
    });
});