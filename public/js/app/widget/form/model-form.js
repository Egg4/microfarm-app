'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/model-form',
    'app/widget/list/error-list',
], function ($, _, ModelForm, ErrorList) {

    return ModelForm.extend({

        initialize: function (options) {
            ModelForm.prototype.initialize.call(this, $.extend(true, {
                events: {
                    error: function (event, errors) {
                        this.errorList.setErrors(errors);
                    }.bind(this),
                },
            }, options));

            $.extend(true, this, {
                errorList: new ErrorList(),
            });

            $(this.el).prepend(this.errorList.el);
        },

        render: function () {
            ModelForm.prototype.render.call(this);

            this.errorList.render();
        },
    });
});