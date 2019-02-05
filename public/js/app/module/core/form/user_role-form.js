'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/input-search-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Form, FormGroup, InputHidden, InputSearch, Select, List, ListItem, Html, Button, Label, Icon) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                id: 'user_role-form',
                collection: app.collections.get('user_role'),
                formGroup: new FormGroup({
                    items: [
                        new InputHidden({
                            name: 'id',
                            required: false,
                            cast: 'integer',
                        }),
                        new InputHidden({
                            name: 'entity_id',
                            cast: 'integer',
                        }),
                        new InputHidden({
                            name: 'user_id',
                            cast: 'integer',
                        }),
                        new FormGroup({
                            items: this.buildSearchFormGroupItems.bind(this),
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'role_id',
                                    placeholder: polyglot.t('form.placeholder.role_id'),
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildRoleData.bind(this),
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openRoleCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                    ],
                }),
            });
        },

        buildSearchFormGroupItems: function () {
            var inputSearch = new InputSearch({
                name: 'email',
                placeholder: polyglot.t('form.placeholder.email'),
            });

            return [
                inputSearch,
                new List({
                    filterId: inputSearch.getElementId(),
                    events: {
                        filterablebeforefilter: this.onSearch.bind(this),
                    },
                }),
            ];
        },

        onSearch: function () {
            var searchList = this.formGroup.items[3].items[1],
                searchValue = this.getElement('email').getValue();

            app.client.send({
                method: 'GET',
                url: '/user',
                data: {
                    email: '*' + searchValue + '*',
                    range: '0-3',
                },
            }).done(function(data) {
                searchList.items = _.map(data, this.buildListItem.bind(this));
                searchList.render();
            }.bind(this));
        },

        buildListItem: function (user) {
            return new ListItem({
                content: new Html({
                    template: '<div><%- first_name %> <%- last_name %></div><div><%- email %></div>',
                    data: user,
                    events: {
                        click: function () {
                            this.selectUser(user);
                        }.bind(this),
                    },
                }),
            });
        },

        selectUser: function (user) {
            this.getElement('email').setValue(user.email);
            this.getElement('user_id').setValue(user.id);
        },

        buildRoleData: function () {
            return app.collections.get('role').map(function(role) {
                return {
                    value: role.get('id'),
                    label: role.getDisplayName(),
                };
            });
        },

        openRoleCreationDialog: function () {
            var dialog = app.dialogs.get('role');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.role').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
            });
            dialog.form.setVisible({});
            dialog.open().done(function (role) {
                var roleSelect = this.getElement('role_id');
                roleSelect.setValue(role.get('id'));
                roleSelect.render();
                $(roleSelect.el).trigger('change');
            }.bind(this));
        },

        getData: function () {
            var data = Form.prototype.getData.call(this);
            delete data.email;
            return data;
        },
    });
});