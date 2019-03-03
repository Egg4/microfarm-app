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
            zone: _.template('<%= name %>'),
            block: _.template('<%= name %>'),
            bed: _.template('<%= name %>'),
            crop: _.template($('#planner-page-crop-timeline-template').html()),
        },

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'planner-page',
                header: this.buildHeader.bind(this),
                body: this.buildBody.bind(this),
            });
        },

        /*---------------------------------------- Header ---------------------------------------*/
        buildHeader: function () {
            return new Header({
                title: polyglot.t('planner-page.title'),
                icon: new Icon({name: 'map'}),
                back: true,
                menu: app.panels.get('main-menu'),
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
                className: 'zones',
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
                            template: this.template.zone,
                            data: zone.toJSON(),
                        }),
                    }),
                    new Cell({
                        className: 'content',
                        content: this.buildBlocksTable(blocks),
                    }),
                ],
            });
        },

        buildBlocksTable: function (blocks) {
            return new Table({
                className: 'blocks',
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
                            template: this.template.block,
                            data: block.toJSON(),
                        }),
                    }),
                    new Cell({
                        className: 'content',
                        content: this.buildBedsTable(beds),
                    }),
                ],
            });
        },

        buildBedsTable: function (beds) {
            return new Table({
                className: 'beds',
                rows: _.map(beds, this.buildBedRow.bind(this)),
            });
        },

        buildBedRow: function (bed) {
            var crops = _.map(bed.findAll('crop_location'), function (cropLocation) {
                return cropLocation.find('crop');
            });
            crops = _.sortBy(crops, function (crop) {
                var tasks = crop.findAll('task');
                tasks = _.sortBy(tasks, function (task) {
                    return task.get('date') + task.get('time');
                });
                if (tasks.length > 0) {
                    var firstTask = _.first(tasks);
                    return firstTask.get('date') + firstTask.get('time');
                }
                return '';
            });

            return new Row({
                cells: [
                    new Cell({
                        content: new Html({
                            className: 'bed',
                            template: this.template.bed,
                            data: bed.toJSON(),
                        }),
                    }),
                    new Cell({
                        className: 'content',
                        content: this.buildCropsContainer(crops),
                    }),
                ],
            });
        },

        buildCropsContainer: function (crops) {
            return new StackLayout({
                className: 'crops',
                items: _.map(crops, this.buildCropHtml.bind(this)),
            });
        },

        buildCropHtml: function (crop) {
            return new Html({
                className: 'crop',
                css: this.buildCropCss(crop),
                template: this.template.crop,
                data: this.buildCropData(crop),
                events: {
                    click: function () {
                        app.router.navigate('crop/' + crop.get('id'));
                    },
                },
            });
        },

        buildCropCss: function (crop) {
            var css = {},
                meta = this.buildCropMeta(crop),
                currentYear = new Date().getFullYear(),
                firstDayOfYear = new Date(currentYear, 0, 1),
                lastDayOfYear = new Date(currentYear, 11, 31),
                totalYearDays = lastDayOfYear.getDayOfYear();

            var yearStartDate = meta.startDate >= firstDayOfYear ? meta.startDate : firstDayOfYear,
                yearEndDate = meta.endDate <= lastDayOfYear ? meta.endDate : lastDayOfYear;

            var width = (Date.diffDays(yearStartDate, yearEndDate) + 1) / totalYearDays * 100;
            css['width'] = width.toFixed(2) + '%';

            var marginLeft = (yearStartDate.getDayOfYear() - 1) / totalYearDays * 100;
            css['margin-left'] = marginLeft.toFixed(2) + '%';

            if (meta.startDate < firstDayOfYear) {
                css['border-left'] = 'none';
                css['border-top-left-radius'] = '0';
                css['border-bottom-left-radius'] = '0';
            }

            if (meta.endDate > lastDayOfYear) {
                css['border-right'] = 'none';
                css['border-top-right-radius'] = '0';
                css['border-bottom-right-radius'] = '0';
            }

            return css;
        },

        buildCropMeta: function (crop) {
            var currentYear = new Date().getFullYear(),
                firstDayOfYear = new Date(currentYear, 0, 1),
                lastDayOfYear = new Date(currentYear, 11, 31),
                meta = {
                    startDate: firstDayOfYear,
                    endDate: lastDayOfYear,
                },
                tasks = crop.findAll('task');

            if (tasks.length > 0) {
                tasks = _.sortBy(tasks, function (task) {
                    return task.get('date') + task.get('time');
                });

                meta.startDate = new Date(_.first(tasks).get('date'));
                meta.endDate = new Date(_.last(tasks).get('date'));
            }

            return meta;
        },

        buildCropData: function (crop) {
            var article = crop.find('article');
            return $.extend(crop.toJSON(), {
                article: article.toJSON(),
            });
        },
    });
});