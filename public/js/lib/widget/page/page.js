'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                layout: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('page-widget');
            $('body').append(this.el);
            $(this.el).page();
        },

        render: function () {
            Widget.prototype.render.call(this);

            var layout = _.isFunction(this.layout) ? this.layout() : this.layout;
            $(this.el).html(layout.el);
            layout.render();

            $(this.el).page({
                enhanced: true,
            });
        },
    });
});