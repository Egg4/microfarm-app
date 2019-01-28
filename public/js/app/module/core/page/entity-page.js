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
                id: 'entity-page',
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: new Icon({name: 'home'}),
                collection: app.collections.get('entity'),
                body: this.buildBody.bind(this),
            });
        },

        setData: function () {
            var entityId = app.authentication.getEntityId();
            this.model = this.collection.get(entityId);
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    this.buildEntityHtml(),
                    this.buildIconGrid(),
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
            if (app.modules.has('taxonomy')) {
                buttons.push(this.buildVarietiesButton());
            }
            if (app.modules.has('basic-production')) {
                buttons.push(this.buildArticlesButton());
            }
            if (app.modules.has('land')) {
                buttons.push(this.buildZonesButton());
            }
            return buttons;
        },

        buildVarietiesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('varieties-page.title'),
                    icon: new Icon({name: 'dna'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('varieties');
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
                        app.router.navigate('entity/articles');
                    },
                },
            });
        },

        buildZonesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('zones-page.title'),
                    icon: new Icon({name: 'sitemap'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('zones');
                    },
                },
            });
        },

        /*---------------------------------------- Entity ------------------------------------------*/
        buildEntityHtml: function () {
            return new Html({
                className: 'model-view',
                template: $('#entity-page-model-template').html(),
                data: function () {
                    return this.buildEntityHtmlData();
                }.bind(this),
            });
        },

        buildEntityHtmlData: function () {
            return this.model.toJSON();
        },

        /*---------------------------------------- Icons ------------------------------------------*/
        buildIconGrid: function () {
            return new GridLayout({
                css: {
                    'text-align': 'center',
                    'font-size': '2em',
                },
                column: 5,
                items: [
                    new Icon({name: 'hammer'}),
                    new Icon({name: 'screwdriver'}),
                    new Icon({name: 'wrench'}),
                    new Icon({name: 'thermometer-half'}),
                    new Icon({name: 'sitemap'}),
                    new Icon({name: 'grip-horizontal'}),
                    new Icon({name: 'grip-vertical'}),
                    new Icon({name: 'th-large'}),
                    new Icon({name: 'th'}),
                    new Icon({name: 'bars'}),
                    new Icon({name: 'align-justify'}),
                    new Icon({name: 'vector-square'}),
                    new Icon({name: 'leaf'}),
                    new Icon({name: 'seedling'}),
                    new Icon({name: 'cannabis'}),
                    new Icon({name: 'apple-alt'}),
                    new Icon({name: 'lemon'}),
                    new Icon({name: 'eye'}),
                    new Icon({name: 'book'}),
                    new Icon({name: 'tree'}),
                    new Icon({name: 'bug'}),
                    new Icon({name: 'crow'}),
                    new Icon({name: 'frog'}),
                    new Icon({name: 'spider'}),
                    new Icon({name: 'feather-alt'}),
                    new Icon({name: 'project-diagram'}),
                    new Icon({name: 'clipboard-list'}),
                    new Icon({name: 'dna'}),
                    new Icon({name: 'balance-scale'}),
                    new Icon({name: 'barcode'}),
                    new Icon({name: 'qrcode'}),
                    new Icon({name: 'bong'}),
                    new Icon({name: 'skull-crossbones'}),
                    new Icon({name: 'flask'}),
                    new Icon({name: 'fill-drip'}),
                    new Icon({name: 'box-open'}),
                    new Icon({name: 'briefcase-medical'}),
                    new Icon({name: 'medkit'}),
                    new Icon({name: 'first-aid'}),
                    new Icon({name: 'certificate'}),
                    new Icon({name: 'cloud-sun-rain'}),
                    new Icon({name: 'cog'}),
                    new Icon({name: 'database'}),
                    new Icon({name: 'warehouse'}),
                    new Icon({name: 'cubes'}),
                    new Icon({name: 'dice-d6'}),
                    new Icon({name: 'dolly'}),
                    new Icon({name: 'file-invoice-dollar'}),
                    new Icon({name: 'layer-group'}),
                    new Icon({name: 'parachute-box'}),
                    new Icon({name: 'shopping-bag'}),
                    new Icon({name: 'shopping-basket'}),
                    new Icon({name: 'shopping-cart'}),
                    new Icon({name: 'clock'}),
                    new Icon({name: 'camera-retro'}),
                    new Icon({name: 'camera'}),
                    new Icon({name: 'image'}),
                ],
            });
        },
    });
});