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
                title: this.title,
                icon: this.icon,
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

        render: function () {
            this.header.title = this.title;
            this.header.icon = this.icon;
            Page.prototype.render.call(this);
        },

        open: function (data) {
            this.setData(data);
            this.render();
            this.deferred = $.Deferred();
            this.previousPageEl = $.mobile.activePage;
            $.mobile.changePage($(this.el) , {
                reverse: false,
                changeHash: false,
                transition: 'none',
            });
            window.scrollTo(0, 0);
            return this.deferred.promise();
        },

        close: function (data) {
            $.mobile.changePage(this.previousPageEl , {
                reverse: false,
                changeHash: false,
                transition: 'none',
            });
            window.scrollTo(0, 0);
            this.deferred.resolve(data);
        },
    });
});