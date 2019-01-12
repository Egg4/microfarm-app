'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/popup/popup',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'lib/widget/layout/grid-layout',
], function ($, _, Popup, Header, StackLayout, GridLayout) {

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
            var items = [];
            items.push(this.buildHeader());
            items.push(this.body);
            if (this.buttons.length > 0) {
                items.push(this.buildButtons());
            }
            return new StackLayout({
                items: items,
            });
        },

        buildHeader: function () {
            return new Header({
                position: false,
                title: function () {
                    return _.isFunction(this.title) ? this.title() : this.title;
                }.bind(this),
                icon: function () {
                    return _.isFunction(this.icon) ? this.icon() : this.icon;
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