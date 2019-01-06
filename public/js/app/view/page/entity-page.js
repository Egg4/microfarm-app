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
                    menu: false,
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
                                            icon: new Icon({name: 'leaf'}),
                                        }),
                                        iconAlign: 'top',
                                        events: {
                                            click: function () {
                                                //app.router.navigate('varieties');
                                                app.dialogs.get('article').show();
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
                                                app.router.navigate('articles');
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
                    ],
                }),
            });
        },

        setData: function () {
            this.entity = app.collections.get('entity').at(0);
            this.entityHtml.data = this.entity.toJSON();
        },
    });
});