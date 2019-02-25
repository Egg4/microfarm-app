'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-view-page',
    'lib/widget/layout/stack-layout',
    'lib/widget/navigation/navigation',
    'lib/widget/layout/grid-layout',
    'lib/widget/html/html',
    'app/widget/table/model-table',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, StackLayout, Navigation, GridLayout, Html, Table, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'role-page',
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: new Icon({name: 'users'}),
                collection: app.collections.get('role'),
                body: this.buildBody.bind(this),
            });

            if (app.modules.has('access')) {
                this.listenTo(app.collections.get('role_access'), 'update', this.render);
            }
        },

        buildBody: function () {
            var items = [];
            items.push(this.buildNavigation());
            items.push(this.buildRoleHtml());
            if (app.modules.has('access')) {
                items.push(this.buildRoleAccessTable());
            }

            return new StackLayout({
                items: items,
            });
        },

        /*---------------------------------------- Navigation ------------------------------------------*/
        buildNavigation: function () {
            var items = this.buildNavigationButtons();
            return new Navigation({
                layout: new GridLayout({
                    column: items.length,
                    items: items,
                }),
            });
        },

        buildNavigationButtons: function () {
            var buttons = [];
            if (app.authentication.can('read', 'role')) {
                buttons.push(this.buildRolesButton());
            }
            if (app.authentication.can('update', 'role')) {
                buttons.push(this.buildEditButton());
            }

            return buttons;
        },

        buildRolesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('roles-page.title'),
                    icon: new Icon({name: 'users'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('roles');
                    },
                },
            });
        },

        buildEditButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model-view-page.button.edit'),
                    icon: new Icon({name: 'pencil-alt'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.openEditionDialog({
                            formVisible: {},
                        });
                    }.bind(this),
                },
            });
        },

        /*---------------------------------------- Role ------------------------------------------*/
        buildRoleHtml: function () {
            return new Html({
                className: 'model-view',
                template: $('#role-page-model-template').html(),
                data: function () {
                    return this.buildRoleHtmlData();
                }.bind(this),
            });
        },

        buildRoleHtmlData: function () {
            return this.model.toJSON();
        },

        /*---------------------------------------- Access -------------------------------------*/
        buildRoleAccessTable: function () {
            return new Table({
                title: polyglot.t('role-page.role_access-table.title'),
                icon: new Icon({name: 'lock'}),
                collection: app.collections.get('role_access'),
                models: this.buildRoleAccess.bind(this),
                modelRow: {
                    template: _.template($('#role-page-role_access-table-row-template').html()),
                    data: this.buildRoleAccessRowData.bind(this),
                    events: {
                        click: false,
                    },
                },
                modelForm: {
                    data: this.buildRoleAccessFormData.bind(this),
                    visible: this.buildRoleAccessFormVisible.bind(this),
                },
            });
        },

        buildRoleAccess: function () {
            return app.collections.get('role_access').where({
                role_id: this.model.get('id'),
            });
        },

        buildRoleAccessRowData: function (roleAccess) {
            return $.extend(roleAccess.toJSON(), {
                access: {
                    create: roleAccess.get('create'),
                    update: roleAccess.get('update'),
                    delete: roleAccess.get('delete'),
                },
            });
        },

        buildRoleAccessFormData: function () {
            return {
                entity_id: this.model.get('entity_id'),
                role_id: this.model.get('id'),
            };
        },

        buildRoleAccessFormVisible: function () {
            return {
                role_id: false,
            };
        },
    });
});