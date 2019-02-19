'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
], function ($, _, Container) {

    return Container.extend({

        initialize: function () {
            Container.prototype.initialize.call(this);
            this.fetchFlag = false;
        },

        build: function (name, collectionSchema, modelSchema) {
            var collection = new collectionSchema.class(null, {
                collections: this,
                modelName: name,
                url: collectionSchema.url || '/' + name,
                comparator: collectionSchema.comparator || 'id',
                foreignKeys: collectionSchema.foreignKeys || {},
                uniqueKey: collectionSchema.uniqueKey || [],
            });
            collection.model = modelSchema.class.extend({
                collection: collection,
                displayName: modelSchema.displayName || 'id',
            });

            return collection;
        },

        registerForeignKeysHandlers: function () {
            this.each(function(collection) {
                var foreignCollections = this.getForeignCollections(collection);
                _.each(foreignCollections, function (foreignCollection) {
                    this.listenTo(collection, 'remove', foreignCollection.handleForeignKeys.bind(foreignCollection));
                }.bind(this));
            }.bind(this));
        },

        unregisterForeignKeysHandlers: function () {
            this.each(function(collection) {
                this.stopListening(collection, 'remove');
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