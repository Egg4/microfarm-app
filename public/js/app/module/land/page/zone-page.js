'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-view-page',
    'lib/widget/layout/stack-layout',
    'lib/widget/navigation/navigation',
    'lib/widget/layout/grid-layout',
    'lib/widget/html/html',
    'app/widget/table/model-table',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, StackLayout, Navigation, GridLayout, Html, Table, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'zone-page',
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: new Icon({name: 'sitemap'}),
                collection: app.collections.get('zone'),
                body: this.buildBody.bind(this),
            });

            this.listenTo(app.collections.get('block'), 'update', this.render);
            this.listenTo(app.collections.get('bed'), 'update', this.render);
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    this.buildZoneHtml(),
                    this.buildBlockTable(),
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
            if (app.authentication.can('read', 'zone')) {
                buttons.push(this.buildZonesButton());
            }
            if (app.authentication.can('update', 'zone')) {
                buttons.push(this.buildEditButton());
            }

            return buttons;
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

        buildEditButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model-view-page.button.edit'),
                    icon: new Icon({name: 'pencil-alt'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.openEditionDialog({
                            formVisible: {
                                category_id: true,
                                name: true,
                            },
                        });
                    }.bind(this),
                },
            });
        },

        /*---------------------------------------- Zone ----------------------------------------*/
        buildZoneHtml: function () {
            return new Html({
                className: 'model-view',
                template: $('#zone-page-model-template').html(),
                data: this.buildZoneHtmlData.bind(this),
            });
        },

        buildZoneHtmlData: function () {
            var category = this.model.find('category');
            return $.extend(this.model.toJSON(), {
                category: category.toJSON(),
            });
        },

        /*---------------------------------------- Block ------------------------------------------*/
        buildBlockTable: function () {
            return new Table({
                title: polyglot.t('zone-page.block-table.title'),
                icon: new Icon({name: 'th-large'}),
                collection: app.collections.get('block'),
                models: this.buildBlocks.bind(this),
                modelRow: {
                    template: _.template($('#zone-page-block-table-row-template').html()),
                    data: this.buildBlockRowData.bind(this),
                },
                modelForm: {
                    data: this.buildBlockFormData.bind(this),
                    visible: this.buildBlockFormVisible.bind(this),
                },
            });
        },

        buildBlocks: function () {
            return app.collections.get('block').where({
                zone_id: this.model.get('id'),
            });
        },

        buildBlockRowData: function (block) {
            var beds = block.findAll('bed');
            return $.extend(block.toJSON(), {
                bedCount: beds.length,
            });
        },

        buildBlockFormData: function () {
            return {
                entity_id: this.model.get('entity_id'),
                zone_id: this.model.get('id'),
            };
        },

        buildBlockFormVisible: function () {
            return {
                zone_id: false,
                name: true,
            };
        },
    });
});