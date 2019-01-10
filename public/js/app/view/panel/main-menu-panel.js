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

        buildLogoutButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('main-menu-panel.button.logout'),
                    icon: new Icon({name: 'sign-out-alt'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        var promises = [
                            this.close(),
                            app.authentication.logout(),
                        ];
                        app.loader.show();
                        $.when.apply($, promises).done(function() {
                            app.collections.resetAll();
                            app.router.navigate('login');
                        }).always(function () {
                            app.loader.hide();
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