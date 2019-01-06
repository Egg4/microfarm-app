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
            var searchForm = FormFactory.create('search', {modelName: 'organization'});

            Page.prototype.initialize.call(this, {
                id: 'clients-page',
                header: HeaderFactory.create('main', {
                    title: 'Clients',
                    icon: 'balance-scale',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        organizationTable: this.createOrganizationTable(searchForm),
                    },
                }),
            });
        },

        createOrganizationTable: function (searchForm) {
            return ModelTableFactory.create('organization', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (entity) {
                    return entity.findAll('organization', {where: {client: true}});
                },
                rowTemplate: _.template($('#clients-page-organization-table-row-template').html()),
                rowData: function (organization) {
                    return $.extend(organization.toJSON(), {

                    });
                },
                listenToCollections: ['organization'],
                formData: function (entity) {
                    return {
                        entity_id: entity.get('id'),
                        supplier: false,
                        client: true,
                    };
                },
            });
        },

        render: function (options) {
            this.entity = app.collections.get('entity').at(0);

            Page.prototype.render.call(this, options);

            this.header.items.searchForm.render();
            this.body.items.organizationTable.render({
                parentModel: this.entity,
            });
        },
    });
});