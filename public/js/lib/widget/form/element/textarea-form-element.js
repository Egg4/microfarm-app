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
                placeholder: false,
                rows: 3,
                maxlength: 8192,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('textarea-form-element-widget');

            this.element = $('<textarea>');
            this.element.attr('id', this.getElementId());
            this.element.attr('name', this.name);
            if (this.placeholder) {
                this.element.attr('placeholder', this.placeholder);
            }
            if (this.rows) {
                this.element.attr('rows', this.rows);
            }
            if (this.maxlength) {
                this.element.attr('maxlength', this.maxlength);
            }

            this.setValue(this.getDefaultValue());
        },

        setValue: function (value) {
            this.value = (this.nullable && _.isNull(value)) ? '' : value;
            this.element.val(this.value);
        },

        getValue: function () {
            if (this.nullable && this.value === '') {
                return null;
            }
            return this.value;
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