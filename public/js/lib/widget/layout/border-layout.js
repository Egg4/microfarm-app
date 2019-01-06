'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/layout/layout',
], function ($, _, Layout) {

    return Layout.extend({

        initialize: function (options) {
            Layout.prototype.initialize.call(this, options);

            var defaults = {
                top: false,
                left: false,
                center: false,
                right: false,
                bottom: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('border-layout-widget');
        },

        render: function () {
            Layout.prototype.render.call(this);

            if (this.top) {
                var top = _.isFunction(this.top) ? this.top() : this.top,
                    wrapper = $('<div class="top">');
                wrapper.append(top.el);
                $(this.el).append(wrapper);
                top.render();
            }
            if (this.left) {
                var left = _.isFunction(this.left) ? this.left() : this.left,
                    wrapper = $('<div class="left">');
                wrapper.append(left.el);
                $(this.el).append(wrapper);
                left.render();
            }
            if (this.center) {
                var center = _.isFunction(this.center) ? this.center() : this.center,
                    wrapper = $('<div class="center">');
                wrapper.append(center.el);
                $(this.el).append(wrapper);
                center.render();
            }
            if (this.right) {
                var right = _.isFunction(this.right) ? this.right() : this.right,
                    wrapper = $('<div class="right">');
                wrapper.append(right.el);
                $(this.el).append(wrapper);
                right.render();
            }
            if (this.bottom) {
                var bottom = _.isFunction(this.bottom) ? this.bottom() : this.bottom,
                    wrapper = $('<div class="bottom">');
                wrapper.append(bottom.el);
                $(this.el).append(wrapper);
                bottom.render();
            }
        },
    });
});