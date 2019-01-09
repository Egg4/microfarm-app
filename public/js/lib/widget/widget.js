'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.View.extend({
        tagName: 'div',

        initialize: function (options) {
            Backbone.View.prototype.initialize.call(this);

            var defaults = {
                id: false,
                className: false,
                attributes: {},
                css: {},
                events: {},
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            if (this.id) {
                $(this.el).attr('id', this.id);
            }
            $(this.el).css(this.css);
            $(this.el).addClass('widget');
        },

        setData: function (data) {
            if (_.isObject(data)) {
                $.extend(true, this, data);
            }
        },

        render: function () {
            this.delegateEvents(this.events);
        },
    });
});