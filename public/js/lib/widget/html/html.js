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
                template: '',
                data: {},
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            this.template = _.template(this.template);
            $(this.el).addClass('html-widget');
        },

        render: function () {
            Widget.prototype.render.call(this);

            var data = _.isFunction(this.data) ? this.data() : this.data;
            $(this.el).html(this.template(data));
        },
    });
});