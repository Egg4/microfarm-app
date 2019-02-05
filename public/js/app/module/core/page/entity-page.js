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
                ],
            });
        },

        /*---------------------------------------- Navigation ------------------------------------------*/
        buildNavigation: function () {
            var row1Items = this.buildNavigationRow1Buttons(),
                row2Items = this.buildNavigationRow2Buttons();
            return new Navigation({
                layout: new StackLayout({
                    items: [
                        new GridLayout({
                            column: row1Items.length,
                            items: row1Items,
                        }),
                        new GridLayout({
                            column: row2Items.length,
                            items: row2Items,
                        }),
                    ],
                }),
            });
        },

        buildNavigationRow1Buttons: function () {
            var buttons = [];
            if (app.modules.has('taxonomy') && app.authentication.can('read', 'variety')) {
                buttons.push(this.buildVarietiesButton());
            }
            if (app.modules.has('basic-production') && app.authentication.can('read', 'article')) {
                buttons.push(this.buildArticlesButton());
            }
            if (app.modules.has('land') && app.authentication.can('read', 'zone')) {
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

        buildNavigationRow2Buttons: function () {
            var buttons = [];
            if (app.modules.has('access') && app.authentication.isAdmin()) {
                buttons.push(this.buildUsersButton());
                buttons.push(this.buildRolesButton());
            }
            return buttons;
        },

        buildUsersButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('users-page.title'),
                    icon: new Icon({name: 'user'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('users');
                    },
                },
            });
        },

        buildRolesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('roles-page.title'),
                    icon: new Icon({name: 'users'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('roles');
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
    });
});