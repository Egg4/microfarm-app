'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-list-page',
    'app/widget/bar/header-bar',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'organizations-page',
                title: this.buildTitle.bind(this),
                icon: this.buildIcon.bind(this),
                collection: app.collections.get('organization'),
                tableOptions: {
                    models: this.buildOrganizations.bind(this),
                    groupedModels: this.buildGroupedOrganizations.bind(this),
                    modelRow: {
                        template: _.template($('#organizations-page-organization-table-row-template').html()),
                        data: this.buildOrganizationRowData.bind(this),
                    },
                    modelForm: {
                        data: this.buildOrganizationFormData.bind(this),
                        visible: this.buildOrganizationFormVisible.bind(this),
                    },
                },
            });
        },

        buildTitle: function () {
            return this.filter.supplier ? polyglot.t('suppliers-page.title') : polyglot.t('clients-page.title');
        },

        buildIcon: function () {
            return this.filter.supplier ? new Icon({name: 'truck'}) : new Icon({name: 'store-alt'});
        },

        buildOrganizations: function () {
            var filter = this.filter.supplier ? {supplier: true} : {client: true},
                organizations = this.collection.where(filter);

            return _.sortBy(organizations, function (organization) {
                return organization.getDisplayName().removeDiacritics();
            });
        },

        buildGroupedOrganizations: function (organizations) {
            return _.groupBy(organizations, function (organization) {
                return organization.getDisplayName().charAt(0).removeDiacritics().toUpperCase();
            });
        },

        buildOrganizationRowData: function (organization) {
            return organization.toJSON();
        },

        buildOrganizationFormData: function () {
            return {
                entity_id: this.filter.entity_id,
                supplier: this.filter.supplier,
                client: this.filter.client,
            };
        },

        buildOrganizationFormVisible: function () {
            return {
                name: true,
                number: true,
                supplier: !this.filter.supplier,
                client: !this.filter.client,
            };
        },

        setSuppliersData: function () {
            this.filter = {
                entity_id: app.authentication.get('entity_id'),
                supplier: true,
                client: false,
            };
        },

        setClientsData: function () {
            this.filter = {
                entity_id: app.authentication.get('entity_id'),
                supplier: false,
                client: true,
            };
        },
    });
});