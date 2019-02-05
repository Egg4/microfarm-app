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
            }, options);

            if (this.isUserLogged()) {
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

        isUserLogged: function () {
            return !_.isNull(this.storage.getItem(this.namespace + '.key'));
        },

        isEntitySelected: function () {
            if (!this.isUserLogged()) return false;
            var data = this.getData();
            return !_.isUndefined(data.user_role);
        },

        getUserId: function () {
            if (!this.isUserLogged()) {
                throw new Error('User not logged');
            }
            var data = this.getData();
            return data.user.id;
        },

        getUserRoleId: function () {
            if (!this.isEntitySelected()) {
                throw new Error('Entity not selected');
            }
            var data = this.getData();
            return data.user_role.id;
        },

        getEntityId: function () {
            if (!this.isEntitySelected()) {
                throw new Error('Entity not selected');
            }
            var data = this.getData();
            return data.user_role.entity_id;
        },

        getRoleId: function () {
            if (!this.isEntitySelected()) {
                throw new Error('Entity not selected');
            }
            var data = this.getData();
            return data.user_role.role_id;
        },

        isAdmin: function () {
            return _.isNull(this.getRoleId());
        },

        can: function (action, resource) {
            if (this.isAdmin()) return true;
            if (action === 'read') return true;

            var roleAccess = app.collections.get('role_access').find({
                role_id: this.getRoleId(),
                resource: resource,
            });

            return roleAccess && roleAccess.has(action) && roleAccess.get(action)
        },

        activate: function (key) {
            return this.client.send({
                method: 'POST',
                url: '/user/activate',
                data: {key: key},
            });
        },

        logout: function () {
            var deferred = $.Deferred();

            if (this.isUserLogged()) {
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