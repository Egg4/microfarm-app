'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/element/form-element',
], function ($, _, FormElement) {

    return FormElement.extend({

        initialize: function (options) {
            FormElement.prototype.initialize.call(this, $.extend(true, {
                defaultValue: false,
            }, options));

            var defaults = {
                iconAlign: 'left',
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('checkbox-form-element-widget');

            this.element = $('<input>');
            this.element.attr('id', this.getElementId());
            this.element.attr('type', 'checkbox');
            this.element.attr('name', this.name);
            this.element.attr('data-iconpos', this.iconAlign);

            this.setValue(this.getDefaultValue());
        },

        setValue: function (value) {
            FormElement.prototype.setValue.call(this, value);
            this.element.prop('checked', this.value);
        },

        render: function () {
            FormElement.prototype.render.call(this);

            if (this.visible) {
                this.element.val(this.value);
                $(this.el).append(this.element);
                this.element.on('change', function(event) {
                    event.stopPropagation();
                    this.value = this.element.prop('checked');
                    this.trigger('change');
                }.bind(this));
                this.element.checkboxradio();
            }
        },
    });
});