'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
], function ($, _, Container) {

    return Container.extend({

        build: function (name, dialogSchema, formSchema) {
            return function () {
                if (formSchema) {
                    return new dialogSchema.class({
                        id: name + '-dialog',
                        form: new formSchema.class(),
                    });
                }
                return new dialogSchema.class();
            };
        },
    });
});