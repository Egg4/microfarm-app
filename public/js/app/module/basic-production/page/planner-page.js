'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'app/widget/bar/footer-bar',
    'lib/widget/layout/stack-layout',
    'app/widget/popup/menu-popup',
    'lib/widget/table/table',
    'lib/widget/table/row/table-row',
    'lib/widget/table/cell/table-cell',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Footer, StackLayout, MenuPopup, Table, Row, Cell, List, ListItem, Html, Button, Label, Icon) {

    return Page.extend({
        template: {

        },

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'planner-page',
                header: this.buildHeader.bind(this),
                body: this.buildBody.bind(this),
                //footer: this.buildFooter.bind(this),
            });
        },

        /*---------------------------------------- Header ---------------------------------------*/
        buildHeader: function () {
            return new Header({
                title: polyglot.t('planner-page.title'),
                icon: new Icon({name: 'map'}),
                back: true,
                menu: app.panels.get('main-menu'),
                //bottom: this.buildCalendarHeader.bind(this),
            });
        },

        /*---------------------------------------- Body ---------------------------------------*/
        buildBody: function () {
            var zones = app.collections.get('zone').toArray();

            return new StackLayout({
                className: 'planner-body',
                items: [
                    this.buildZonesTable(zones),
                ],
            });
        },

        buildZonesTable: function (zones) {
            return new Table({
                className: 'planner-zones-table',
                rows: _.map(zones, this.buildZoneRow.bind(this)),
            });
        },

        buildZoneRow: function (zone) {
            var blocks = zone.findAll('block');

            return new Row({
                cells: [
                    new Cell({
                        content: new Html({
                            className: 'zone',
                            template: '<%= name %>',
                            data: zone.toJSON(),
                        }),
                    }),
                    new Cell({
                        content: this.buildBlocksTable(blocks),
                    }),
                ],
            });
        },

        buildBlocksTable: function (blocks) {
            return new Table({
                className: 'planner-blocks-table',
                rows: _.map(blocks, this.buildBlockRow.bind(this)),
            });
        },

        buildBlockRow: function (block) {
            var beds = block.findAll('bed');

            return new Row({
                cells: [
                    new Cell({
                        content: new Html({
                            className: 'block',
                            template: '<%= name %>',
                            data: block.toJSON(),
                        }),
                    }),
                    new Cell({
                        content: this.buildBedsTable(beds),
                    }),
                ],
            });
        },

        buildBedsTable: function (beds) {
            return new Table({
                className: 'planner-beds-table',
                rows: _.map(beds, this.buildBedRow.bind(this)),
            });
        },

        buildBedRow: function (bed) {
            var weeks = _.range(0, 52, 1);

            return new Row({
                cells: [
                    new Cell({
                        content: new Html({
                            className: 'bed',
                            template: '<%= name %>',
                            data: bed.toJSON(),
                        }),
                    }),
                    new Cell({
                        content: this.buildWeeksTable(weeks),
                    }),
                ],
            });
        },

        buildWeeksTable: function (weeks) {
            return new Table({
                className: 'planner-weeks-table',
                rows: [
                    new Row({
                        cells: _.map(weeks, this.buildWeekCell.bind(this)),
                    }),
                ],
            });
        },

        buildWeekCell: function (week) {
            return new Cell({
                content: new Html({
                    className: 'week',
                    template: '<%= number %>',
                    data: {
                        number: week,
                    },
                }),
            });
        },
    });
});