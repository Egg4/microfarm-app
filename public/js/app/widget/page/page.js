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

            var items = [];
            if (this.header) {
                $(this.header.el).addClass('page-header');
                items.push(this.header);
            }
            if (this.body) {
                $(this.body.el).addClass('page-body');
                items.push(this.body);
            }
            if (this.footer) {
                $(this.footer.el).addClass('page-footer');
                items.push(this.footer);
            }

            Page.prototype.initialize.call(this, $.extend(true, {
                layout: new StackLayout({items: items}),
            }, options));
        },
    });
});