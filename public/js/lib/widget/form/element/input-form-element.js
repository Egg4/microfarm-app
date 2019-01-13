'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/element/form-element',
], function ($, _, FormElement) {

    return FormElement.extend({

        initialize: function (options) {
            FormElement.prototype.initialize.call(this, options);

            var defaults = {
                type: false,
                placeholder: false,
                maxlength: false,
                autocomplete: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('input-form-element-widget');

            this.element = $('<input>');
            this.element.attr('id', this.getElementId());
            this.element.attr('type', this.type);
            this.element.attr('name', this.name);
            if (this.placeholder !== false) {
                this.element.attr('placeholder', this.placeholder);
            }
            if (this.maxlength !== false) {
                this.element.attr('maxlength', this.maxlength);
            }
            if (this.autocomplete !== false) {
                this.element.attr('autocomplete', this.autocomplete);
            }

            this.setValue(this.getDefaultValue());
        },

        setValue: function (value) {
            FormElement.prototype.setValue.call(this, value);
            this.element.val(this.value);
        },

        render: function () {
            FormElement.prototype.render.call(this);

            if (this.visible) {
                this.element.val(this.value);
                $(this.el).append(this.element);
                this.element.on('keyup', function(event) {
                    event.stopPropagation();
                    this.value = this.element.val();
                    $(this.el).trigger('keyup');
                }.bind(this));
                this.element.on('change', function(event) {
                    event.stopPropagation();
                    this.value = this.element.val();
                    $(this.el).trigger('change');
                }.bind(this));
                this.element.textinput();
            }
        },
    });
});