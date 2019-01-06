'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/element/input-number-form-element',
], function ($, _, InputNumberFormElement) {

    return InputNumberFormElement.extend({

        initialize: function (options) {
            InputNumberFormElement.prototype.initialize.call(this, $.extend(true, {
                type: 'range',
            }, options));

            $(this.el).addClass('input-range-form-element-widget');

            this.element.attr('data-role', 'none');
        },
    });
});