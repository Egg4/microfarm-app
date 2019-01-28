'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'form',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, $.extend(true, {
                events: {
                    submit: function (event) {
                        event.preventDefault();
                        return false;
                    }.bind(this),
                },
            }, options));

            var defaults = {
                formGroup: false,
                autocomplete: 'off',
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('form-widget');
            if (this.autocomplete) {
                $(this.el).attr('autocomplete', this.autocomplete);
            }

            $(this.el).append(this.formGroup.el);
            this.elements = this.formGroup.getElements();
        },

        render: function () {
            Widget.prototype.render.call(this);

            this.formGroup.render();
            this.hideErrors();
        },

        getElement: function(key) {
            return this.elements[key];
        },

        getDefaultData: function() {
            var data = {};
            _.each(this.elements, function(element) {
                data[element.getName()] = element.getDefaultValue();
            });
            return data;
        },

        getData: function() {
            var data = {};
            _.each(this.elements, function(element) {
                data[element.getName()] = element.getValue();
            });
            return data;
        },

        setData: function(data) {
            data = $.extend({}, this.getDefaultData(), data);
            _.each(this.elements, function(element) {
                element.setValue(data[element.getName()]);
            });
        },

        getDefaultVisible: function() {
            var visible = {};
            _.each(this.elements, function(element) {
                visible[element.getName()] = element.isDefaultVisible();
            });
            return visible;
        },

        setVisible: function(visible) {
            visible = $.extend({}, this.getDefaultVisible(), visible);
            _.each(this.elements, function(element) {
                element.setVisible(visible[element.getName()]);
            });
        },

        validate: function () {
            this.hideErrors();

            var errors = [];
            _.each(this.elements, function(element) {
                var validator = element.getValidator();
                if (_.isFunction(validator)) {
                    var message = validator(element.getValue());
                    if (message) {
                        errors.push({
                            attributes: [element.getName()],
                            message: message,
                        });
                    }
                }
                else {
                    if (element.isRequired()) {
                        var value = element.getValue();
                        var name = element.getName();
                        if (_.isUndefined(value)
                            || _.isNaN(value)
                            || (_.isNull(value) && !element.isNullable())
                            || (_.isString(value) && value.length == 0)) {
                            var fieldName = polyglot.t('form.field.' + name, {_: name});
                            errors.push({
                                attributes: [name],
                                message: polyglot.t('form.validator.required', {
                                    _: '%{field}: field required',
                                    field: fieldName,
                                }),
                            });
                        }
                    }
                }
            });
            errors = _.union(errors, this.validator(this.getData()));
            this.showErrors(errors);

            return (errors.length == 0);
        },

        validator: function (data) {
            return [];
        },

        hideErrors: function() {
            this.$('.has-error').removeClass('has-error');
            $(this.el).trigger('error', [[]]);
        },

        showErrors: function(errors) {
            if (errors.length > 0) {
                _.each(errors, function(error) {
                    _.each(error.attributes, function(attribute) {
                        this.$('[name=' + attribute + ']').parent().addClass('has-error');
                    }.bind(this));
                }.bind(this));
                $(this.el).trigger('error', [errors]);
            }
        },
    });
});