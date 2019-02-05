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
                id: 'block-page',
                title: function () {
                    var zone = this.model.find('zone');
                    return zone.get('name') + ' ' +  this.model.get('name');
                }.bind(this),
                icon: new Icon({name: 'th-large'}),
                collection: app.collections.get('block'),
                body: this.buildBody.bind(this),
            });

            this.listenTo(app.collections.get('bed'), 'update', this.render);
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    this.buildBedTable(),
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
                buttons.push(this.buildZoneButton());
            }
            if (app.authentication.can('update', 'block')) {
                buttons.push(this.buildEditButton());
            }

            return buttons;
        },

        buildZoneButton: function () {
            var zone = this.model.find('zone');
            return new Button({
                label: new Label({
                    text: zone.getDisplayName(),
                    icon: new Icon({name: 'sitemap'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('zone/' + zone.get('id'));
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
                                name: true,
                            },
                        });
                    }.bind(this),
                },
            });
        },

        /*---------------------------------------- Bed ------------------------------------------*/
        buildBedTable: function () {
            return new Table({
                title: polyglot.t('block-page.bed-table.title'),
                icon: new Icon({name: 'align-justify'}),
                collection: app.collections.get('bed'),
                models: this.buildBeds.bind(this),
                modelRow: {
                    template: _.template($('#block-page-bed-table-row-template').html()),
                    data: this.buildBedRowData.bind(this),
                    events: {
                        click: false,
                    },
                },
                modelForm: {
                    data: this.buildBedFormData.bind(this),
                    visible: this.buildBedFormVisible.bind(this),
                },
            });
        },

        buildBeds: function () {
            return app.collections.get('bed').where({
                block_id: this.model.get('id'),
            });
        },

        buildBedRowData: function (bed) {
            return $.extend(bed.toJSON(), {

            });
        },

        buildBedFormData: function () {
            return {
                entity_id: this.model.get('entity_id'),
                block_id: this.model.get('id'),
            };
        },

        buildBedFormVisible: function () {
            return {
                block_id: false,
                name: true,
            };
        },
    });
});