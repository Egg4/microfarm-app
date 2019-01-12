'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
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
            this.entityHtml = new Html({
                template: $('#entity-page-model-template').html(),
            });

            Page.prototype.initialize.call(this, {
                id: 'entity-page',
                header: new Header({
                    title: polyglot.t('entity-page.title'),
                    icon: new Icon({name: 'home'}),
                    back: true,
                    menu: app.panels.get('main-menu'),
                }),
                body: new StackLayout({
                    items: [
                        new Navigation({
                            layout: new GridLayout({
                                column: 3,
                                items: [
                                    new Button({
                                        label: new Label({
                                            text: polyglot.t('entity-page.button.varieties'),
                                            icon: new Icon({name: 'dna'}),
                                        }),
                                        iconAlign: 'top',
                                        events: {
                                            click: function () {
                                                app.router.navigate('varieties');
                                            },
                                        },
                                    }),
                                    new Button({
                                        label: new Label({
                                            text: polyglot.t('entity-page.button.articles'),
                                            icon: new Icon({name: 'shopping-cart'}),
                                        }),
                                        iconAlign: 'top',
                                        events: {
                                            click: function () {
                                                app.router.navigate('entity/articles');
                                            },
                                        },
                                    }),
                                    new Button({
                                        label: new Label({
                                            text: polyglot.t('entity-page.button.zones'),
                                            icon: new Icon({name: 'map'}),
                                        }),
                                        iconAlign: 'top',
                                        events: {
                                            click: function () {
                                                app.router.navigate('zones');
                                            },
                                        },
                                    }),
                                ],
                            }),
                        }),
                        this.entityHtml,
                        new GridLayout({
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
                                new Icon({name: 'cubes'}),
                                new Icon({name: 'dice-d6'}),
                                new Icon({name: 'dolly'}),
                                new Icon({name: 'file-invoice-dollar'}),
                                new Icon({name: 'layer-group'}),
                                new Icon({name: 'parachute-box'}),
                                new Icon({name: 'shopping-bag'}),
                                new Icon({name: 'shopping-basket'}),
                                new Icon({name: 'shopping-cart'}),
                            ],
                        }),
                    ],
                }),
            });
        },

        setData: function () {
            var entityId = app.authentication.getEntityId();
            this.entity = app.collections.get('entity').get(entityId);
            this.entityHtml.setData({
                data: this.entity.toJSON(),
            });
        },
    });
});