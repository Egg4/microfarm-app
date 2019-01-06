'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'view/widget/navigation/navigation',
], function ($, _, Page, Body, HeaderFactory, Navigation) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'organization-page',
                header: HeaderFactory.create('main', {
                    title: 'Organization',
                    icon: 'building',
                }),
                body: new Body({
                    items: {
                        navigation: this.buildNavigation(),
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#organization-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                    },
                }),
            });

            this.listenTo(app.collections.get('organization'), 'update', this.render);
        },

        buildNavigation: function () {
            return new Navigation({
                rows: [{
                    varieties: {
                        text: 'Articles',
                        icon: 'shopping-cart',
                        iconAlign: 'top',
                        events: {
                            click: function() {
                                return app.router.navigate('articles');
                            },
                        },
                    },
                    purchases: {
                        text: 'Achats',
                        icon: 'money-bill-alt',
                        iconAlign: 'top',
                        events: {
                            click: function() {
                                //return app.router.navigate('tasks');
                            },
                        },
                    },
                    sales: {
                        text: 'Ventes',
                        icon: 'balance-scale',
                        iconAlign: 'top',
                        events: {
                            click: function() {
                                //return app.router.navigate('tasks');
                            },
                        },
                    },
                }],
            });
        },

        render: function (options) {
            options = options || {};
            this.organization = options.organization || this.organization;

            Page.prototype.render.call(this, options);

            this.header.render();
            this.body.items.modelBody.render(this.organization.toJSON());
        },

        onHoldModelBody: function () {
            app.dialogs.get('organization').show({
                title: 'Edit ' + this.organization.getDisplayName(),
                form: {
                    data: this.organization.toJSON(),
                },
            });
        },
    });
});