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
                if (schema.collection) {
                    this.set(key, this.buildCollection(key, schema));
                }
            }.bind(this));

            this.registerForeignKeysHandlers();
            this.fetchFlag = false;
        },

        buildCollection: function (key, schema) {
            var collection = new schema.collection.class(null, {
                collections: this,
                modelName: key,
                url: schema.collection.url || '/' + key,
                comparator: schema.collection.comparator || 'id',
                foreignKeys: schema.collection.foreignKeys || {},
                uniqueKey: schema.collection.uniqueKey || [],
            });
            collection.model = schema.model.class.extend({
                collection: collection,
                displayName: schema.model.displayName || 'id',
            });

            return collection;
        },

        registerForeignKeysHandlers: function () {
            this.each(function(collection) {
                var foreignCollections = this.getForeignCollections(collection);
                _.each(foreignCollections, function(foreignCollection) {
                    collection.on({
                        remove: foreignCollection.handleForeignKeys.bind(foreignCollection),
                    });
                });
            }.bind(this));
        },

        getForeignCollections: function (collection) {
            var foreignCollections = [];
            this.each(function(foreignCollection) {
                _.each(foreignCollection.foreignKeys, function(foreignKey) {
                    if (foreignKey.model === collection.modelName) {
                        foreignCollections.push(foreignCollection);
                    }
                });
            });
            return foreignCollections;
        },

        fetchAll: function () {
            var deferred = $.Deferred();

            var resources = this.map(function(collection) {
                return collection.modelName;
            });

            app.loader.show();
            app.client.send({
                method: 'POST',
                url: '/entity/all',
                data: {
                    resources: resources,
                },
            }).done(function(data) {
                _.each(data, function(models, key) {
                    this.get(key).reset(models);
                }.bind(this));
                this.fetchFlag = true;
                deferred.resolve();
            }.bind(this)).always(function() {
                app.loader.hide();
            }.bind(this));

            return deferred.promise();
        },

        resetAll: function () {
            this.each(function(collection) {
                collection.reset();
            });

            this.fetchFlag = false;
        },

        fetched: function () {
            return this.fetchFlag;
        },
    });
});