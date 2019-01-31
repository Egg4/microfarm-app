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
                items: this.buildButtons(),
            }, options));
        },

        buildButtons: function () {
            var buttons = [];
            if (app.modules.has('basic-production')) {
                buttons.push(this.buildPlannerButton());
            }
            if (app.modules.has('core')) {
                buttons.push(this.buildEntityButton());
            }
            if (app.modules.has('basic-production')) {
                buttons.push(this.buildCropsButton());
            }
            if (app.modules.has('basic-production')) {
                buttons.push(this.buildOutputsButton());
            }
            if (app.modules.has('trade')) {
                buttons.push(this.buildSuppliersButton());
            }
            if (app.modules.has('trade')) {
                buttons.push(this.buildClientsButton());
            }
            if (app.modules.has('core')) {
                buttons.push(this.buildLogoutButton());
            }
            return buttons;
        },

        buildPlannerButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('main-menu-panel.button.planner'),
                    icon: new Icon({name: 'calendar-alt'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.redirect('planner');
                    }.bind(this),
                },
            });
        },

        buildEntityButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('main-menu-panel.button.entity'),
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
                    text: polyglot.t('main-menu-panel.button.crops'),
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

        buildOutputsButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('main-menu-panel.button.outputs'),
                    icon: new Icon({name: 'dolly'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.redirect('outputs');
                    }.bind(this),
                },
            });
        },

        buildSuppliersButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('main-menu-panel.button.suppliers'),
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
                    text: polyglot.t('main-menu-panel.button.clients'),
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