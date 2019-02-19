'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.View.extend({

        initialize: function (options) {
            $.extend(true, this, {
                storage: localStorage,
                storageKey: 'authentication',
                headerKey: 'Authorization',
            }, options);

            if (this.isUserLogged()) {
                app.client.setHeader(this.headerKey, this.get('key'));
            }
        },

        set: function (attributes) {
            this.storage.setItem(this.storageKey, JSON.stringify(attributes));
            app.client.setHeader(this.headerKey, attributes.key);
        },

        get: function (attribute) {
            var data = JSON.parse(this.storage.getItem(this.storageKey));
            if (attribute) {
                return _.has(data, attribute) ? data[attribute] : undefined;
            }
            return data;
        },

        clear: function () {
            this.storage.removeItem(this.storageKey);
            app.client.removeHeader(this.headerKey);
        },

        isUserLogged: function () {
            return (this.get('user_id'));
        },

        isEntitySelected: function () {
            return (this.get('entity_id'));
        },

        isAdmin: function () {
            return !(this.get('role_id'));
        },

        can: function (action, resource) {
            if (this.isAdmin()) return true;
            if (action === 'read') return true;

            var roleAccess = app.collections.get('role_access').find({
                role_id: this.get('role_id'),
                resource: resource,
            });

            return roleAccess && roleAccess.has(action) && roleAccess.get(action)
        },

        activate: function (key) {
            return app.client.send({
                method: 'POST',
                url: '/user/activate',
                data: {key: key},
            });
        },

        logout: function () {
            var deferred = $.Deferred();

            app.unregisterModules();
            app.modules.unregister('core');
            app.modules.register('core');
            this.clear();
            deferred.resolve();

            return deferred.promise();
        },
    });
});