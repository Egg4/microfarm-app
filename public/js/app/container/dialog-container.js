'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
], function ($, _, Container) {

    return Container.extend({

        initialize: function (options) {
            Container.prototype.initialize.call(this);

            options.modules.schemas.each(function (schema, key) {
                if (schema.dialog) {
                    this.set(key, function () {
                        return new schema.dialog.class({
                            form: new schema.form.class(),
                        });
                    });
                }
            }.bind(this));
        },
    });
});