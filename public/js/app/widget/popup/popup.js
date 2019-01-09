'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/popup/popup',
    'app/widget/bar/header-bar',
    'app/widget/bar/footer-bar',
    'lib/widget/layout/stack-layout',
    'lib/widget/layout/grid-layout',
], function ($, _, Popup, Header, Footer, StackLayout, GridLayout) {

    return Popup.extend({

        initialize: function (options) {
            var defaults = {
                title: '',
                icon: false,
                body: false,
                buttons: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Popup.prototype.initialize.call(this, $.extend(true, {
                layout: this.buildLayout(),
            }, options));

            $(this.body.el).addClass('body');
        },

        buildLayout: function () {
            return new StackLayout({
                items: [
                    this.buildHeader(),
                    this.body,
                    this.buildButtons(),
                ],
            });
        },

        buildHeader: function () {
            return new Header({
                position: false,
                title: function () {
                    return this.title;
                }.bind(this),
                icon: function () {
                    return this.icon;
                }.bind(this),
            });
        },

        buildButtons: function () {
            return new GridLayout({
                className: 'buttons',
                column: this.buttons.length,
                items: this.buttons,
            });
        },

        open: function () {
            this.render();
            return Popup.prototype.open.call(this);
        },
    });
});