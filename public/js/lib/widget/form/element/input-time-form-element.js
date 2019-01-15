'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/element/input-form-element',
], function ($, _, InputFormElement) {

    return InputFormElement.extend({

        initialize: function (options) {
            InputFormElement.prototype.initialize.call(this, $.extend(true, {
                type: 'time',
            }, options));

            var defaults = {
                min: false,
                max: false,
                step: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('input-date-form-element-widget');

            if (this.min !== false) {
                this.element.attr('min', this.min);
            }
            if (this.max !== false) {
                this.element.attr('max', this.max);
            }
            if (this.step !== false) {
                this.element.attr('step', this.step);
            }
        },
    });
});