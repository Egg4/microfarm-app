'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, List, ListItem, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'authentication-page',
                header: new Header({
                    title: polyglot.t('authentication-page.title'),
                    icon: new Icon({name: 'home'}),
                }),
                body: new StackLayout({
                    items: [
                        new List({
                            items: this.buildListItems.bind(this),
                        }),
                    ],
                }),
            });
        },

        render: function () {
            app.collections.resetAll();
            this.body.items[0].render(); // Empty list

            this.loadCollections().done(function () {
                var userRoles = app.collections.get('user_role').toArray();
                if (userRoles.length == 1) {
                    this.authenticate(userRoles[0].get('id'));
                }
                else {
                    Page.prototype.render.call(this);
                }
            }.bind(this));
        },

        loadCollections: function () {
            var promises = [];
            promises.push(app.collections.get('entity').fetch({data: {range: '0-1000'}}));
            promises.push(app.collections.get('user_role').fetch({data: {
                user_id: app.authentication.get('user_id'),
                range: '0-1000',
            }}));

            return $.when.apply($, promises);
        },

        buildListItems: function () {
            var items = [];
            app.collections.get('user_role').each(function(userRole) {
                items.push(this.buildListItem(userRole));
            }.bind(this));

            return items;
        },

        buildListItem: function (userRole) {
            var entity = userRole.find('entity');

            return new ListItem({
                content: new Button({
                    label: new Label({
                        text: entity.getDisplayName(),
                        icon: new Icon({name: 'angle-right'}),
                    }),
                    corner: false,
                    iconAlign: 'right',
                    events: {
                        click: function () {
                            this.authenticate(userRole.get('id'));
                        }.bind(this),
                    },
                }),
            });
        },

        authenticate: function (user_role_id) {
            app.loader.show();

            app.client.send({
                method: 'POST',
                url: '/user_role/authenticate',
                data: {
                    id: user_role_id,
                },
            }).done(function(data) {
                app.authentication.set(data);
                app.registerModules();
                app.collections.fetchAll().done(function() {
                    app.router.navigate();
                }).always(function() {
                    app.loader.hide();
                }.bind(this));
            }.bind(this));
        },
    });
});