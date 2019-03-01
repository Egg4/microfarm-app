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
                id: 'article-page',
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: new Icon({name: 'shopping-cart'}),
                collection: app.collections.get('article'),
                body: this.buildBody.bind(this),
            });

            this.listenTo(app.collections.get('article_variety'), 'update', this.render);
        },

        buildBody: function () {
            var category = this.model.find('category'),
                items = [];

            items.push(this.buildNavigation());
            items.push(this.buildArticleHtml());
            if (_.contains(['seed', 'plant', 'harvest'], category.get('key'))) {
                items.push(this.buildVarietyTable());
            }
            return new StackLayout({
                items: items,
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
            if (app.authentication.can('read', 'article')) {
                buttons.push(this.buildArticlesButton());
            }
            if (app.authentication.can('update', 'article')) {
                buttons.push(this.buildEditButton());
            }

            return buttons;
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
                        var organizationId = this.model.get('organization_id');
                        if (organizationId) {
                            app.router.navigate('organization/' + organizationId + '/articles');
                        }
                        else {
                            app.router.navigate('entity/articles');
                        }
                    }.bind(this),
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
                                organization_id: false,
                            },
                        });
                    }.bind(this),
                },
            });
        },

        /*---------------------------------------- Article ----------------------------------------*/
        buildArticleHtml: function () {
            return new Html({
                className: 'model-view',
                template: $('#article-page-model-template').html(),
                data: this.buildArticleHtmlData.bind(this),
            });
        },

        buildArticleHtmlData: function () {
            var entity = this.model.find('entity'),
                organization = this.model.find('organization'),
                category = this.model.find('category'),
                quantityUnit = this.model.find('category', {selfAttribute: 'quantity_unit_id'});
            return $.extend(this.model.toJSON(), {
                entity: entity.toJSON(),
                organization: !_.isNull(organization) ? organization.toJSON() : null,
                category: category.toJSON(),
                quantity_unit: quantityUnit.toJSON(),
            });
        },

        /*---------------------------------------- Variety ----------------------------------------*/
        buildVarietyTable: function () {
            return new Table({
                title: polyglot.t('article-page.variety-table.title'),
                icon: new Icon({name: 'dna'}),
                collection: app.collections.get('article_variety'),
                models: this.buildVarieties.bind(this),
                modelRow: {
                    options: this.buildVarietyRowOptions.bind(this),
                    template: _.template($('#article-page-variety-table-row-template').html()),
                    data: this.buildVarietyRowData.bind(this),
                    events: {
                        click: false,
                    },
                },
                modelForm: {
                    data: this.buildVarietyFormData.bind(this),
                    visible: this.buildVarietyFormVisible.bind(this),
                },
            });
        },

        buildVarieties: function () {
            var articleVarieties = app.collections.get('article_variety').where({
                article_id: this.model.get('id'),
            });

            return _.sortBy(articleVarieties, function (articleVariety) {
                return articleVariety.getDisplayName().removeDiacritics();
            });
        },

        buildVarietyRowOptions: function (articleVariety) {
            var variety = articleVariety.find('variety');
            return {
                className: !_.isNull(variety) && !variety.get('active') ? 'disabled' : '',
            };
        },

        buildVarietyRowData: function (articleVariety) {
            var plant = articleVariety.find('plant'),
                variety = articleVariety.find('variety');
            return $.extend(articleVariety.toJSON(), {
                plant: plant.toJSON(),
                variety: _.isNull(variety) ? null : variety.toJSON(),
            });
        },

        buildVarietyFormData: function () {
            return {
                entity_id: this.model.get('entity_id'),
                article_id: this.model.get('id'),
            };
        },

        buildVarietyFormVisible: function () {
            return {
                article_id: false,
            };
        },
    });
});