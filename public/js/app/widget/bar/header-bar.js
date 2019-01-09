'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/bar/bar',
    'lib/widget/layout/border-layout',
    'lib/widget/layout/flow-layout',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Bar, BorderLayout, FlowLayout, Button, Label, Icon) {

    return Bar.extend({

        initialize: function (options) {
            var defaults = {
                top: false,
                title: '',
                icon: false,
                back: false,
                menu: false,
                bottom: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Bar.prototype.initialize.call(this, $.extend(true, {
                role: 'header',
                position: 'fixed',
                layout: new BorderLayout({
                    top: this.top,
                    left: this.back ? this.buildBackButton() : false,
                    center: this.buildLabel(),
                    right: this.menu ? this.buildMenuButton() : false,
                    bottom: this.bottom,
                }),
            }, options));

            $(this.el).addClass('header');
        },

        buildLabel: function () {
            return new Label({
                className: 'ui-title',
                text: function () {
                    return _.isFunction(this.title) ? this.title() : this.title;
                }.bind(this),
                icon: function () {
                    return _.isFunction(this.icon) ? this.icon() : this.icon;
                }.bind(this),
            });
        },

        buildBackButton: function () {
            return new Button({
                label: new Label({
                    icon: new Icon({name: 'long-arrow-alt-left'}),
                }),
                events: {
                    click: function() {
                        app.router.back();
                    },
                },
            });
        },

        buildMenuButton: function () {
            return new Button({
                label: new Label({
                    icon: new Icon({name: 'ellipsis-v'}),
                }),
                events: {
                    click: function() {
                        this.menu.show();
                    }.bind(this),
                },
            });
        },
    });
});