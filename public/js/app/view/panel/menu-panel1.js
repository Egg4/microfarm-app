'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/panel/panel',
    'view/widget/body/body',
    'view/widget/navigation/navigation',
], function ($, _, Panel, Body, Navigation) {

    return Panel.extend({

        initialize: function () {
            Panel.prototype.initialize.call(this, {
                id: 'menu-panel',
                position: 'right',
                dismissible: true,
                animate: true,
                swipeClose: true,
                display: 'overlay',
                body: new Body({
                    items: {
                        navigation: new Navigation({
                            rows: [{
                                dashboard: {
                                    text: 'Tableau de bord',
                                    icon: 'chart-bar',
                                    iconAlign: 'top',
                                }
                            }, {
                                suppliers: {
                                    text: 'Fournisseurs',
                                    icon: 'building',
                                    iconAlign: 'top',
                                }
                            }, {
                                entity: {
                                    text: 'Ferme',
                                    icon: 'home',
                                    iconAlign: 'top',
                                }
                            }, {
                                production: {
                                    text: 'Production',
                                    icon: 'tractor',
                                    iconAlign: 'top',
                                }
                            }, {
                                postproduction: {
                                    text: 'Post-Production',
                                    icon: 'layer-group',
                                    iconAlign: 'top',
                                }
                            }, {
                                clients: {
                                    text: 'Clients',
                                    icon: 'balance-scale',
                                    iconAlign: 'top',
                                }
                            }, {
                                logout: {
                                    text: 'Logout',
                                    icon: 'sign-out-alt',
                                }
                            }],
                            events: {
                                click: function (route) {
                                    this.redirect(route)
                                }.bind(this),
                            },
                        }),
                    },
                }),
            });
        },

        render: function () {
            Panel.prototype.render.call(this);

            this.body.render();
        },

        redirect: function (route) {
            this.close().done(function() {
                app.router.navigate(route);
            }.bind(this));
        },
    });
});