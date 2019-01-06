'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
], function ($, _, Container) {

    return Container.extend({

        initialize: function (options) {
            Container.prototype.initialize.call(this);

            options.schemas.each(function (schema, key) {
                if (schema.page) {
                    var route = $.extend(true, {
                        name: key,
                        pattern: '',
                        callback: 'setData',
                    }, schema.page.route || {});

                    options.router.route(route.pattern, route.name, route.callback);

                    this.set(key, function () {
                        return new schema.page.class();
                    });
                }
            }.bind(this));
        },
    });
});