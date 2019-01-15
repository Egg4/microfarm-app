'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-view-page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'lib/widget/navigation/navigation',
    'lib/widget/layout/grid-layout',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, Navigation, GridLayout, Html, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'organization-page',
            });
        },

        buildHeader: function () {
            return new Header({
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: function () {
                    return this.model.get('supplier') ? new Icon({name: 'truck'}) : new Icon({name: 'store-alt'});
                }.bind(this),
                back: true,
                menu: app.panels.get('main-menu'),
            });
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    this.buildModelHtml(),
                ],
            });
        },

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

        buildModelHtml: function () {
            return new Html({
                template: $('#organization-page-model-template').html(),
                data: function () {
                    return this.buildModelHtmlData();
                }.bind(this),
            });
        },

        buildModelHtmlData: function () {
            return this.model.toJSON();
        },

        setData: function (id) {
            if (this.model) this.stopListening(this.model);
            this.model = app.collections.get('organization').get(id);
            this.listenTo(this.model, 'update', this.render);
        },
    });
});