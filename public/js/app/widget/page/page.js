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
                layout: this.buildLayout.bind(this),
            }, options));
        },

        buildLayout: function () {
            var items = [];
            if (this.header) {
                var header = _.isFunction(this.header) ? this.header() : this.header;
                items.push(header);
            }
            if (this.body) {
                var body = _.isFunction(this.body) ? this.body() : this.body;
                items.push(body);
            }
            if (this.footer) {
                var footer = _.isFunction(this.footer) ? this.footer() : this.footer;
                items.push(footer);
            }

            return new StackLayout({
                items: items,
            });
        },
    });
});