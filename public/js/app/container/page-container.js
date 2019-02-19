'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
], function ($, _, Container) {

    return Container.extend({

        build: function (name, pageSchema) {
            this.registerRoutes(name, pageSchema.routes);
            return function () {
                return new pageSchema.class();
            };
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
            app.router.route(route.pattern, key, route.callback);
        },
    });
});