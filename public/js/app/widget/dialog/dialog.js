'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'app/widget/bar/footer-bar',
    'lib/widget/layout/stack-layout',
    'lib/widget/layout/grid-layout',
], function ($, _, Page, Header, Footer, StackLayout, GridLayout) {

    return Page.extend({

        initialize: function (options) {
            var defaults = {
                title: '',
                icon: false,
                buttons: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Page.prototype.initialize.call(this, $.extend(true, {
                header: this.buildHeader(),
                footer: this.buildFooter(),
            }, options));

            $(this.el).addClass('dialog');
        },

        buildHeader: function () {
            return new Header({
                title: function () {
                    return this.title;
                }.bind(this),
                icon: function () {
                    return this.icon;
                }.bind(this),
            });
        },

        buildFooter: function () {
            return new Footer({
                layout: new GridLayout({
                    column: this.buttons.length,
                    items: this.buttons,
                }),
            });
        },

        open: function () {
            this.render();
            this.previousPageEl = $.mobile.activePage;
            $.mobile.changePage($(this.el) , {
                reverse: false,
                changeHash: false,
                transition: 'none',
            });
            window.scrollTo(0, 0);
        },

        close: function () {
            $.mobile.changePage(this.previousPageEl , {
                reverse: false,
                changeHash: false,
                transition: 'none',
            });
            window.scrollTo(0, 0);
        },
    });
});