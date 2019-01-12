'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.View.extend({

        initialize: function (options) {
            $.extend(true, this, {
                namespace: 'authentication',
                headerKey: 'Authorization',
                storage: localStorage,
                client: false,
                authorization: {},
            }, options);

            if (this.isSet()) {
                this.client.setHeader(this.headerKey, this.getKey());
            }
        },

        set: function (key, data) {
            this.storage.setItem(this.namespace + '.key', key);
            this.storage.setItem(this.namespace + '.data', JSON.stringify(data));
            this.client.setHeader(this.headerKey, key);
        },

        getKey: function () {
            return this.storage.getItem(this.namespace + '.key');
        },

        getData: function () {
            return JSON.parse(this.storage.getItem(this.namespace + '.data'));
        },

        clear: function () {
            this.storage.removeItem(this.namespace + '.key');
            this.storage.removeItem(this.namespace + '.data');
            this.client.removeHeader(this.headerKey);
        },

        isSet: function () {
            return !_.isNull(this.storage.getItem(this.namespace + '.key'));
        },

        getUserId: function () {
            if (!this.isSet()) return null;
            var data = this.getData();
            return data.user.id;
        },

        getEntityId: function () {
            if (!this.isSet()) return null;
            var data = this.getData();
            return _.isUndefined(data.user_role) ? null : data.user_role.entity_id;
        },

        getRole: function () {
            if (!this.isSet()) return null;
            var data = this.getData();
            if (_.isUndefined(data.user_role)) return null;
            if (_.isNull(data.user_role.role_id)) return 'admin';

            return data.role.name;
        },

        hasRole: function (role) {
            return (this.getRole() == role);
        },

        hasRights: function (model, action) {
            if (_.isUndefined(this.authorization[model])) return false;
            if (_.isUndefined(this.authorization[model][action])) return false;
            var requiredRole = this.authorization[model][action];
            return (requiredRole == '*' || this.hasRole(requiredRole));
        },

        logout: function () {
            var deferred = $.Deferred();

            if (this.isSet()) {
                this.client.send({
                    method: 'POST',
                    url: '/user/logout',
                }).done(function(data) {
                    this.clear();
                    deferred.resolve();
                }.bind(this));
            }
            else {
                this.clear();
                deferred.resolve();
            }

            return deferred.promise();
        },
    });
});