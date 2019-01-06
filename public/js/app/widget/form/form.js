'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/form',
    'app/widget/list/error-list',
], function ($, _, Form, ErrorList) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
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
            Form.prototype.render.call(this);

            this.errorList.render();
        },
    });
});