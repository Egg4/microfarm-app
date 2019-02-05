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
                title: '',
                icon: false,
                onCreationClick: this.onCreationClick.bind(this),
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Bar.prototype.initialize.call(this, $.extend(true, {
                layout: new BorderLayout({
                    left: this.buildLabel(),
                    right: this.onCreationClick ? this.buildCreationButton() : false,
                }),
            }, options));

            $(this.el).addClass('table-bar');
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

        buildCreationButton: function () {
            return new Button({
                label: new Label({
                    icon: new Icon({name: 'plus'}),
                }),
                events: {
                    click: this.onCreationClick,
                },
            });
        },

        onCreationClick: function () {

        },
    });
});