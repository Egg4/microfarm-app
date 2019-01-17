'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'tr',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                cells: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('table-row-widget');
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).empty();
            var cells = _.isFunction(this.cells) ? this.cells() : this.cells;
            _.each(cells, function(cell) {
                $(this.el).append(cell.el);
                cell.render();
            }.bind(this));
        },
    });
});