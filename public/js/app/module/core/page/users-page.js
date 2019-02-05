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
                id: 'users-page',
                title: polyglot.t('users-page.title'),
                icon: new Icon({name: 'user'}),
                collection: app.collections.get('user_role'),
                tableOptions: {
                    models: this.buildUserRoles.bind(this),
                    groupedModels: this.buildGroupedUserRoles.bind(this),
                    modelRow: {
                        template: _.template($('#users-page-user_role-table-row-template').html()),
                        data: this.buildUserRoleRowData.bind(this),
                        events: {
                            click: false,
                            taphold: this.openUserRoleMenuPopup.bind(this),
                        },
                    },
                    modelForm: {
                        data: this.buildUserRoleFormData.bind(this),
                        visible: this.buildUserRoleFormVisible.bind(this),
                    },
                },
            });
        },

        buildUserRoles: function () {
            return this.collection.toArray();
        },

        buildGroupedUserRoles: function (userRoles) {
            return _.groupBy(userRoles, function (userRole) {
                var role = userRole.find('role');
                return role ? role.get('name') : 'Admin';
            });
        },

        buildUserRoleRowData: function (userRole) {
            var user = userRole.find('user');
            return $.extend(userRole.toJSON(), {
                user: user.toJSON(),
            });
        },

        openUserRoleMenuPopup: function (userRole) {
            var userRoleId = app.authentication.getUserRoleId();
            if (userRole.get('id') === userRoleId) return;

            var popup = app.popups.get('menu');
            popup.setData({
                title: userRole.getDisplayName(),
            });
            popup.open().done(function (action) {
                switch (action) {
                    case 'edit': return this.openUserRoleEditionDialog(userRole);
                    case 'delete': return this.openUserRoleDeletionPopup(userRole);
                }
            }.bind(this));
        },

        openUserRoleEditionDialog: function (userRole) {
            var dialog = app.dialogs.get('user_role');
            dialog.setData({
                title: polyglot.t('model-dialog.title.edit', {
                    model: polyglot.t('model.name.user_role').toLowerCase(),
                }),
                icon: new Icon({name: 'pencil-alt'}),
            });
            dialog.form.setData(userRole.toJSON());
            dialog.form.setVisible({
                email: false,
            });
            dialog.open();
        },

        openUserRoleDeletionPopup: function (userRole) {
            var popup = app.popups.get('delete');
            popup.setData({
                model: userRole,
            });
            popup.open();
        },

        buildUserRoleFormData: function () {
            return {
                entity_id: app.authentication.getEntityId(),
            };
        },

        buildUserRoleFormVisible: function () {
            return {};
        },
    });
});