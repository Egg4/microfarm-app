'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
], function ($, _, Container) {

    return Container.extend({

        build: function (name, dialogSchema, formSchema) {
            return function () {
                return new dialogSchema.class({
                    form: new formSchema.class(),
                });
            };
        },
    });
});