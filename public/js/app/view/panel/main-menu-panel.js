'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/panel/menu-panel',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Panel, Button, Label, Icon) {

    return Panel.extend({

        initialize: function (options) {
            Panel.prototype.initialize.call(this, $.extend(true, {
                id: 'main-menu-panel',
                position: 'right',
                items: [
                    this.buildEntityButton(),
                    this.buildCropsButton(),
                    this.buildSuppliersButton(),
                    this.buildClientsButton(),
                    this.buildLogoutButton(),
                ],
            }, options));
        },

        buildEntityButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('entity-page.title'),
                    icon: new Icon({name: 'home'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.redirect('entity');
                    }.bind(this),
                },
            });
        },

        buildCropsButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('crops-page.title'),
                    icon: new Icon({name: 'leaf'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.redirect('crops');
                    }.bind(this),
                },
            });
        },

        buildSuppliersButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('suppliers-page.title'),
                    icon: new Icon({name: 'truck'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.redirect('suppliers');
                    }.bind(this),
                },
            });
        },

        buildClientsButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('clients-page.title'),
                    icon: new Icon({name: 'store-alt'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.redirect('clients');
                    }.bind(this),
                },
            });
        },

        buildLogoutButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('main-menu-panel.button.logout'),
                    icon: new Icon({name: 'sign-out-alt'}),
                }),
                iconAlign: 'top',
                theme: 'b',
                events: {
                    click: function () {
                        this.close();
                        var popup = app.popups.get('confirm');
                        popup.setData({
                            title: polyglot.t('main-menu-panel.button.logout'),
                            icon: new Icon({name: 'sign-out-alt'}),
                            message: polyglot.t('confirm-popup.logout.message'),
                        });
                        popup.open().done(function () {
                            app.loader.show();
                            app.authentication.logout().done(function () {
                                app.collections.resetAll();
                                app.router.navigate('login');
                            }).always(function () {
                                app.loader.hide();
                            });
                        });
                    }.bind(this),
                },
            });
        },

        redirect: function (route) {
            this.close();
            app.router.navigate(route);
        },
    });
});