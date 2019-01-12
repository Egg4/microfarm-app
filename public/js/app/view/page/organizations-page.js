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
                collection: app.collections.get('organization'),
                separatorRowTemplate: _.template('<td colspan="1"><%- separator %></td>'),
                modelRowTemplate: _.template($('#organizations-page-organization-table-row-template').html()),
            });

            this.listenTo(this.collection, 'update', this.render);
        },

        buildHeader: function (searchForm) {
            return new Header({
                title: function () {
                    return this.filter.supplier ? polyglot.t('suppliers-page.title') : polyglot.t('clients-page.title');
                }.bind(this),
                icon: function () {
                    return this.filter.supplier ? new Icon({name: 'truck'}) : new Icon({name: 'store-alt'});
                }.bind(this),
                back: true,
                menu: app.panels.get('main-menu'),
                bottom: searchForm,
            });
        },

        buildRows: function () {
            var filter = this.filter.supplier ? {supplier: true} : {client: true};
            var organizations = app.collections.get('organization').where(filter);
            organizations = _.sortBy(organizations, function (organization) {
                return organization.getDisplayName().removeDiacritics();
            });
            var rowGroups = _.groupBy(organizations, function (organization) {
                return organization.getDisplayName().charAt(0).removeDiacritics().toUpperCase();
            });
            var rows = [];
            _.each(rowGroups, function (organizations, name) {
                rows = _.union(rows, this.buildRowGroup(name, organizations));
            }.bind(this));

            return rows;
        },

        buildModelRowData: function (organization) {
            return organization.toJSON();
        },

        navigateToModelPage: function (organization) {
            app.router.navigate('organization/' + organization.get('id'));
        },

        getModelFormData: function () {
            return {
                entity_id: this.filter.entity_id,
                supplier: this.filter.supplier,
                client: this.filter.client,
            };
        },

        getModelFormVisible: function () {
            return {
                name: true,
                number: true,
                supplier: !this.filter.supplier,
                client: !this.filter.client,
            };
        },

        setSuppliersData: function () {
            this.filter = {
                entity_id: app.authentication.getEntityId(),
                supplier: true,
                client: false,
            };
        },

        setClientsData: function () {
            this.filter = {
                entity_id: app.authentication.getEntityId(),
                supplier: false,
                client: true,
            };
        },
    });
});