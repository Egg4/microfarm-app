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
            _.each(this.items, function(item) {
                $(this.el).append(item.el);
                item.render();
            }.bind(this));
        },

        getElements: function () {
            var elements = {};
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