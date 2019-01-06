'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/element/input-form-element',
], function ($, _, InputFormElement) {

    return InputFormElement.extend({

        initialize: function (options) {
            InputFormElement.prototype.initialize.call(this, $.extend(true, {
                type: 'text',
                maxlength: 255,
            }, options));

            $(this.el).addClass('input-search-form-element-widget');

            this.element.attr('data-type', 'search');
        },

        getDefaultValue: function () {
            return this.value;
        },
    });
});