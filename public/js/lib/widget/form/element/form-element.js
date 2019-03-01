'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
    'lib/widget/form/label/form-label',
], function ($, _, Widget, Label) {

    return Widget.extend({
        tagName: 'div',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                name: '',
                label: false,
                value: '',
                defaultValue: '',
                nullable: false,
                cast: false,
                visible: true,
                defaultVisible: true,
                disabled: false,
                validator: false,
                required: true,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('form-element-widget');

            this.elementId = String.random(8);
            if (this.label) {
                this.label.setElementId(this.elementId);
            }

            this.hiddenElement = $('<input>');
            this.hiddenElement.attr('id', this.getElementId());
            this.hiddenElement.attr('type', 'hidden');
            this.hiddenElement.attr('name', this.name);
        },

        getElementId: function () {
            return this.elementId;
        },

        getName: function () {
            return this.name;
        },

        setValue: function (value) {
            this.value = (this.nullable && _.isNull(value)) ? 'null' : value;
        },

        getValue: function () {
            if (this.nullable) {
                if (this.value === '' || this.value === 'null') {
                    return null;
                }
            }
            if (!this.required && this.value === '') {
                return '';
            }
            switch (this.cast) {
                case 'integer':
                    return parseInt(this.value);
                case 'float':
                    return parseFloat(this.value);
                case 'boolean':
                    return (this.value);
                case 'string':
                default:
                    return String(this.value).trim();
            }
        },

        getRawValue: function () {
            return this.value;
        },

        getDefaultValue: function () {
            return this.defaultValue;
        },

        isNullable: function () {
            return this.nullable;
        },

        setVisible: function (visible) {
            this.visible = visible;
        },

        isVisible: function () {
            return this.visible;
        },

        isDefaultVisible: function () {
            return this.defaultVisible;
        },

        isRequired: function () {
            return this.required;
        },

        setDisabled: function (disabled) {
            this.disabled = disabled;
        },

        isDisabled: function () {
            return this.disabled;
        },

        getValidator: function () {
            return this.validator;
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).empty();
            if (this.visible) {
                $(this.el).removeClass('hidden');
                if (this.disabled) {
                    $(this.element).attr('disabled', 'disabled');
                }
                else {
                    $(this.element).removeAttr('disabled');
                }
                if (this.label) {
                    $(this.el).append(this.label.el);
                    this.label.render();
                }
            }
            else {
                $(this.el).addClass('hidden');
                this.hiddenElement.val(this.value);
                $(this.el).append(this.hiddenElement);
            }
        },
    });
});