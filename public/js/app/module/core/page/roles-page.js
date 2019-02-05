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
                id: 'roles-page',
                title: polyglot.t('roles-page.title'),
                icon: new Icon({name: 'role'}),
                collection: app.collections.get('role'),
                tableOptions: {
                    models: this.buildRoles.bind(this),
                    modelRow: {
                        template: _.template($('#roles-page-role-table-row-template').html()),
                        data: this.buildRoleRowData.bind(this),
                    },
                    modelForm: {
                        data: this.buildRoleFormData.bind(this),
                        visible: this.buildRoleFormVisible.bind(this),
                    },
                },
            });
        },

        buildRoles: function () {
            return this.collection.toArray();
        },

        buildRoleRowData: function (role) {
            return $.extend(role.toJSON(), {

            });
        },

        buildRoleFormData: function () {
            return {
                entity_id: app.authentication.getEntityId(),
            };
        },

        buildRoleFormVisible: function () {
            return {};
        },
    });
});