'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/element/form-element',
], function ($, _, FormElement) {

    return FormElement.extend({

        initialize: function (options) {
            FormElement.prototype.initialize.call(this, options);

            $(this.el).addClass('photo-form-element-widget');

            this.image = $('<img>');

            this.element = $('<input>');
            this.element.attr('id', this.getElementId());
            this.element.attr('type', 'hidden');
            this.element.attr('name', this.name);

            this.setValue(this.getDefaultValue());
        },

        setValue: function (value) {
            FormElement.prototype.setValue.call(this, value);
            this.element.val(this.value);
        },

        render: function () {
            FormElement.prototype.render.call(this);

            if (this.visible) {
                this.image.attr('src', this.value);
                $(this.el).append(this.image);
                $(this.el).append(this.element);
            }
        },
    });
});