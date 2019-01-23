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

            this.fetchFlag = false;
        },

        buildCollection: function (key, schema) {
            return new schema.collection.class(null, {
                collections: this,
                modelName: key,
                model: schema.model.class.extend({
                    displayName: schema.model.displayName || 'id',
                }),
                url: schema.collection.url || '/' + key,
                comparator: schema.collection.comparator || 'id',
                foreignKeys: schema.collection.foreignKeys || {},
                uniqueAttributes: schema.collection.uniqueAttributes || [],
            });
        },

        fetchAll: function () {
            var deferred = $.Deferred();

            app.loader.show();
            var promises = [];
            this.each(function(collection) {
                promises.push(collection.fetch({
                    reset: true,
                    data: {range: '0-1000'},
                }));
            });

            $.when.apply($, promises)
                .done(function() {
                    this.fetchFlag = true;
                    deferred.resolve();
                }.bind(this))
                .always(function() {
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