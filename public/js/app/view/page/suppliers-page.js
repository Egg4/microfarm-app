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
                id: 'suppliers-page',
                header: HeaderFactory.create('main', {
                    title: 'Fournisseurs',
                    icon: 'building',
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
                    return entity.findAll('organization', {where: {supplier: true}});
                },
                rowTemplate: _.template($('#suppliers-page-organization-table-row-template').html()),
                rowData: function (organization) {
                    return $.extend(organization.toJSON(), {

                    });
                },
                listenToCollections: ['organization'],
                formData: function (entity) {
                    return {
                        entity_id: entity.get('id'),
                        supplier: true,
                        client: false,
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