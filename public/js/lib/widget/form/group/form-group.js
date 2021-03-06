'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
    'lib/widget/form/element/form-element',
], function ($, _, Widget, FormElement) {

    var FormGroup = Widget.extend({
        tagName: 'div',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                type: 'vertical',
                items: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('form-group-widget');
        },

        render: function () {
            Widget.prototype.render.call(this);

            $(this.el).removeAttr('type');
            $(this.el).attr('type', this.type);

            $(this.el).empty();
            this.items = _.isFunction(this.items) ? this.items() : this.items;
            _.each(this.items, function(item) {
                $(this.el).append(item.el);
                item.render();
            }.bind(this));

            var elements = this.getElements();

            var visible = _.keys(elements).length == 0;
            _.each(elements, function(element) {
                if (element.isVisible()) visible = true;
            });
            if (visible) {
                $(this.el).removeClass('hidden');
                $(this.el).show();
            } else {
                $(this.el).addClass('hidden');
                $(this.el).hide();
            }

            var disabled = _.keys(elements).length > 0;
            _.each(elements, function(element) {
                if (!element.isDisabled()) disabled = false;
            });
            if (disabled) {
                $(this.el).children('.widget:not(.form-element-widget)').addClass('ui-state-disabled');
            } else {
                $(this.el).children('.widget:not(.form-element-widget)').removeClass('ui-state-disabled');
            }
        },

        getElements: function () {
            var elements = {};
            this.items = _.isFunction(this.items) ? this.items() : this.items;
            _.each(this.items, function(item) {
                if (item instanceof FormElement) {
                    elements[item.getName()] = item;
                }
                if (item instanceof FormGroup) {
                    _.each(item.getElements(), function(element) {
                        elements[element.getName()] = element;
                    });
                }
            });

            return elements;
        },
    });

    return FormGroup;
});