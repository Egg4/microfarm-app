'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-view-page',
    'lib/widget/layout/stack-layout',
    'lib/widget/navigation/navigation',
    'lib/widget/layout/grid-layout',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, StackLayout, Navigation, GridLayout, Html, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'organization-page',
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: function () {
                    return this.model.get('supplier') ?
                        new Icon({name: 'truck'}) :
                        new Icon({name: 'store-alt'});
                }.bind(this),
                collection: app.collections.get('organization'),
                body: this.buildBody.bind(this),
            });
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    this.buildOrganizationHtml(),
                ],
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
            if (app.authentication.can('read', 'organization') && this.model.get('supplier')) {
                buttons.push(this.buildSuppliersButton());
            }
            if (app.authentication.can('read', 'organization') && this.model.get('client')) {
                buttons.push(this.buildClientsButton());
            }
            if (app.authentication.can('read', 'article') && this.model.get('supplier')) {
                buttons.push(this.buildArticlesButton());
            }
            if (app.authentication.can('update', 'organization')) {
                buttons.push(this.buildEditButton());
            }

            return buttons;
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
                        app.router.navigate('suppliers');
                    },
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
                        app.router.navigate('clients');
                    },
                },
            });
        },

        buildArticlesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('articles-page.title'),
                    icon: new Icon({name: 'shopping-cart'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('organization/' + this.model.get('id') + '/articles');
                    }.bind(this),
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
                        this.openEditionDialog();
                    }.bind(this),
                },
            });
        },

        /*
        buildPurchasesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('organization-page.button.purchases'),
                    icon: new Icon({name: 'money-bill-alt'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        //app.router.navigate('organization/' + this.model.get('id') + '/purchases');
                    }.bind(this),
                },
            });
        },

        buildSalesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('organization-page.button.sales'),
                    icon: new Icon({name: 'balance-scale'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        //app.router.navigate('organization/' + this.model.get('id') + '/sales');
                    }.bind(this),
                },
            });
        },
        */

        /*---------------------------------------- Organization ------------------------------------------*/
        buildOrganizationHtml: function () {
            return new Html({
                className: 'model-view',
                template: $('#organization-page-model-template').html(),
                data: function () {
                    return this.buildOrganizationHtmlData();
                }.bind(this),
            });
        },

        buildOrganizationHtmlData: function () {
            return this.model.toJSON();
        },
    });
});