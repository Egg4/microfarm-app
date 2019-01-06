'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'lib/widget/layout/grid-layout',
], function ($, _, Page, Header, StackLayout, GridLayout) {

    return Page.extend({

        initialize: function (options) {
            var defaults = {
                title: '',
                icon: false,
                content: false,
                buttons: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Page.prototype.initialize.call(this, $.extend(true, {
                header: new Header({
                    title: this.title,
                    icon: this.icon,
                }),
                body: new StackLayout({
                    items: [
                        this.content,
                        new GridLayout({
                            column: this.buttons.length,
                            items: this.buttons,
                        }),
                    ],
                }),
            }, options));
        },

        render: function () {
            this.header.title = this.title;
            this.header.icon = this.icon;
            this.body.items[0] = this.content;
            this.body.items[1].column = this.buttons.length;
            this.body.items[1].items = this.buttons;
            Page.prototype.render.call(this);
        },

        show: function () {
            this.render();
            this.previousPageEl = $.mobile.activePage;
            $.mobile.changePage($(this.el) , {
                reverse: false,
                changeHash: false,
                transition: 'none',
            });
        },

        hide: function () {
            $.mobile.changePage(this.previousPageEl , {
                reverse: false,
                changeHash: false,
                transition: 'none',
            });
        },
    });
});