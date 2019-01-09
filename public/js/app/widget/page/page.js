'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/page/page',
    'lib/widget/layout/stack-layout',
], function ($, _, Page, StackLayout) {

    return Page.extend({

        initialize: function (options) {
            var defaults = {
                header: false,
                body: false,
                footer: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Page.prototype.initialize.call(this, $.extend(true, {
                layout: this.buildLayout(),
            }, options));
        },

        buildLayout: function () {
            var items = [];
            if (this.header) {
                items.push(this.header);
            }
            if (this.body) {
                items.push(this.body);
            }
            if (this.footer) {
                items.push(this.footer);
            }

            return new StackLayout({
                items: items,
            });
        },
    });
});