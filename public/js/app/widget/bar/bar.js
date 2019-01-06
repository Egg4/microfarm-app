'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/bar/bar',
    'lib/widget/layout/border-layout',
    'lib/widget/layout/flow-layout',
], function ($, _, Bar, BorderLayout, FlowLayout) {

    return Bar.extend({

        initialize: function (options) {
            var defaults = {
                top: false,
                leftButtons: false,
                label: false,
                rightButtons: false,
                bottom: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            var left = (this.leftButtons.length > 0) ? new FlowLayout({
                items: this.leftButtons,
            }) : false;

            var right = (this.rightButtons.length > 0) ? new FlowLayout({
                items: this.rightButtons,
            }) : false;

            Bar.prototype.initialize.call(this, $.extend(true, {
                layout: new BorderLayout({
                    top: this.top,
                    left: left,
                    center: this.label,
                    right: right,
                    bottom: this.bottom,
                }),
            }, options));
        },
    });
});