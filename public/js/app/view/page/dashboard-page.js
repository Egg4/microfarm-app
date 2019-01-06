'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/factory/bar-factory',
    'app/view/form/dashboard-form',
    'lib/widget/layout/stack-layout',
    'lib/widget/layout/grid-layout',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Bar, DashboardForm, StackLayout, GridLayout, Html, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'dashboard-page',
                header: Bar.create('header', {
                    title: polyglot.t('dashboard-page.title'),
                    icon: new Icon({name: 'tag'}),
                }),
                body: new StackLayout({
                    items: [
                        new DashboardForm(),
                        new GridLayout({
                            items: [
                                new Button({
                                    label: new Label({
                                        text: polyglot.t('form.button.cancel'),
                                        icon: new Icon({name: 'times'}),
                                    }),
                                }),
                                new Button({
                                    label: new Label({
                                        text: polyglot.t('form.button.submit'),
                                        icon: new Icon({name: 'check'}),
                                    }),
                                    theme: 'b',
                                    events: {
                                        click: function () {
                                            var form = this.body.items[0];
                                            form.validate();
                                            console.log(form.getData());
                                        }.bind(this),
                                    },
                                }),
                            ],
                        }),
                    ],
                }),
            });
        },
    });
});