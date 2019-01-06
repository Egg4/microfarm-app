'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/loader/loader',
    'lib/widget/layout/stack-layout',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Loader, StackLayout, Label, Icon) {

    return Loader.extend({

        initialize: function () {
            Loader.prototype.initialize.call(this, {
                id: 'loader',
                layout: new StackLayout({
                    items: [
                        new Label({
                            text: polyglot.t('loader.default-text'),
                            icon: new Icon({
                                name: 'spinner',
                                pulse: true,
                            }),
                        }),
                    ],
                }),
            });
        },
    });
});