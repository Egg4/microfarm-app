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
                optgroup: false,
                data: {},
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('select-form-element-widget');

            this.element = $('<select>');
            this.element.attr('id', this.getElementId());
            this.element.attr('name', this.name);
            this.element.attr('data-shadow', 'false');

            this.setValue(this.getDefaultValue());
        },

        setValue: function (value) {
            FormElement.prototype.setValue.call(this, value);
            this.element.val(this.value);
        },

        render: function () {
            FormElement.prototype.render.call(this);

            if (this.visible) {
                var data = _.isFunction(this.data) ? this.data() : this.data;
                this.element.empty();
                if (this.optgroup) {
                    _.each(data, function(items, label) {
                        var optgroup = $('<optgroup>');
                        optgroup.attr('label', label);
                        _.each(items, function(item) {
                            optgroup.append(
                                '<option value="' + item.value + '">' + item.label + '</option>'
                            );
                        }.bind(this));
                        this.element.append(optgroup);
                    }.bind(this));
                }
                else {
                    _.each(data, function(item) {
                        this.element.append(
                            '<option value="' + item.value + '">' + item.label + '</option>'
                        );
                    }.bind(this));
                }
                this.element.val(this.value);
                $(this.el).append(this.element);
                this.element.on('change', function(event) {
                    event.stopPropagation();
                    this.value = this.element.val();
                    this.trigger('change');
                }.bind(this));
                this.element.selectmenu();
            }
        },
    });
});