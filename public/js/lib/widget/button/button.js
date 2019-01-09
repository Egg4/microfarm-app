'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'a',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                label: false,
                active: false,
                align: false,
                corner: true,
                iconAlign: 'left',
                theme: 'a',
                state: 'enabled',
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('button-widget');
            $(this.el).button();
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).removeClassPattern(/(^|\s)ui-btn\S+/g);
            $(this.el).removeClassPattern(/(^|\s)ui-corner-\S+/g);
            $(this.el).removeClassPattern(/(^|\s)ui-state-\S+/g);

            $(this.el).addClass('ui-btn');
            if (this.label.text === false) {
                $(this.el).addClass('ui-btn-icon-notext');
            }
            else {
                $(this.el).addClass('ui-btn-icon-' + this.iconAlign);
            }
            if (this.active) {
                $(this.el).addClass('ui-btn-active');
            }
            if (this.align) {
                $(this.el).addClass('ui-btn-' + this.align);
            }
            if (this.corner) {
                $(this.el).addClass('ui-corner-all');
            }
            if (this.theme) {
                $(this.el).addClass('ui-btn-' + this.theme);
            }
            if (this.state) {
                $(this.el).addClass('ui-state-' + this.state);
            }

            $(this.el).html(this.label.el);
            this.label.render();
            $(this.el).button({
                enhanced: true,
            });
        },
    });
});