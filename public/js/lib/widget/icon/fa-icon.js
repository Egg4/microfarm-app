'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/icon/icon',
], function ($, _, Icon) {

    return Icon.extend({
        tagName: 'i',
        
        initialize: function (options) {
            Icon.prototype.initialize.call(this, options);

            var defaults = {
                style: 'fas',
                name: '',
                size: false, // xs, sm, lg, 1x, 2x, 3x, 5x, 7x, 10x
                stack: false, // 1x, 2x, 3x, 5x, 7x, 10x
                fixedWidth: false,
                rotate: false, // 90, 180, 270
                flip: false, // horizontal, vertical
                inverse: false,
                spin: false,
                pulse: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));
        },

        render: function () {
            Icon.prototype.render.call(this);

            $(this.el).removeClassPattern(/(^|\s)fa\S+/g);

            $(this.el).addClass('fa-icon-widget');
            $(this.el).addClass(this.style);
            $(this.el).addClass('fa-' + this.name);
            if (this.size) {
                $(this.el).addClass('fa-' + this.size);
            }
            if (this.stack) {
                $(this.el).addClass('fa-stack-' + this.stack);
            }
            if (this.fixedWidth) {
                $(this.el).addClass('fa-fw');
            }
            if (this.rotate) {
                $(this.el).addClass('fa-rotate-' + this.rotate);
            }
            if (this.flip) {
                $(this.el).addClass('fa-flip-' + this.flip);
            }
            if (this.inverse) {
                $(this.el).addClass('fa-inverse');
            }
            if (this.spin) {
                $(this.el).addClass('fa-spin');
            }
            if (this.pulse) {
                $(this.el).addClass('fa-pulse');
            }
        },
    });
});