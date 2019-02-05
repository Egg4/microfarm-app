'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'ul',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                filterId: false,
                items: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('list-widget');

            if (this.filterId) {
                $(this.el).attr('data-filter', 'true');
                $(this.el).attr('data-input', '#' + this.filterId);
                $(this.el).filterable();
            }
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).empty();
            var items = _.isFunction(this.items) ? this.items() : this.items;
            _.each(items, function (item) {
                $(this.el).append(item.el);
                item.render();
            }.bind(this));

            if (this.filterId) {
                $(this.el).filterable({
                    enhanced: true,
                    input: '#' + this.filterId,
                    filter: function() {
                        window.scrollTo(0, 0);
                    },
                });
                $(this.el).filterable('refresh');
            }
        },
    });
});