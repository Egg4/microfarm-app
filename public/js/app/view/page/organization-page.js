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
                    return this.model.get('supplier') ? new Icon({name: 'truck'}) : new Icon({name: 'store-alt'});
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
            return new Navigation({
                layout: function () {
                    var items = [];
                    if (this.model.get('supplier')) {
                        items.push(this.buildArticlesButton());
                        items.push(this.buildPurchasesButton());
                    }
                    if (this.model.get('client')) {
                        items.push(this.buildSalesButton());
                    }
                    return new GridLayout({
                        column: items.length,
                        items: items,
                    })
                }.bind(this),
            });
        },

        buildArticlesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('organization-page.button.articles'),
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

        /*---------------------------------------- Organization ------------------------------------------*/
        buildOrganizationHtml: function () {
            return new Html({
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