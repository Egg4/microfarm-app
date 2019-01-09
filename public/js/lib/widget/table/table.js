'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'table',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                filterId: false,
                rows: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('table-widget');
            $(this.el).table();

            if (this.filterId) {
                $(this.el).attr('data-filter', 'true');
                $(this.el).attr('data-input', '#' + this.filterId);
                $(this.el).filterable();
            }
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).empty();
            var rows = _.isFunction(this.rows) ? this.rows() : this.rows;
            _.each(rows, function(row) {
                row.render();
                $(this.el).append(row.el);
            }.bind(this));

            $(this.el).table({
                enhanced: true,
            });

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