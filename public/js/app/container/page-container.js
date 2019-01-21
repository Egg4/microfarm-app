'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
], function ($, _, Container) {

    return Container.extend({

        initialize: function (options) {
            Container.prototype.initialize.call(this);

            this.router = options.router;

            options.modules.schemas.each(function (schema, key) {
                if (schema.page) {
                    this.registerRoutes(key, schema.page.routes);
                    this.set(key, function () {
                        return new schema.page.class();
                    });
                }
            }.bind(this));
        },

        registerRoutes: function (key, routes) {
            _.each(routes, function (route) {
                this.registerRoute(key, route);
            }.bind(this));
        },

        registerRoute: function (key, route) {
            route = $.extend(true, {
                pattern: '',
                callback: 'setData',
            }, route);
            this.router.route(route.pattern, key, route.callback);
        },
    });
});