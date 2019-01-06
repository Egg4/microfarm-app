'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/factory/collection-factory',
], function ($, _, Container, CollectionFactory) {

    return Container.extend({

        initialize: function () {
            Container.prototype.initialize.call(this, {
                entity: CollectionFactory.create('entity', {
                    uniqueAttributes: ['name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                family: CollectionFactory.create('family', {
                    uniqueAttributes: ['name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                genus: CollectionFactory.create('genus', {
                    uniqueAttributes: ['family_id', 'name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                species: CollectionFactory.create('species', {
                    uniqueAttributes: ['genus_id', 'name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                plant: CollectionFactory.create('plant', {
                    uniqueAttributes: ['species_id', 'name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                variety: CollectionFactory.create('variety', {
                    uniqueAttributes: ['plant_id', 'name'],
                    comparator: 'name',
                    displayName: function () {
                        return this.find('plant').getDisplayName() + ' ' + this.get('name');
                    },
                }),
                organization: CollectionFactory.create('organization', {
                    uniqueAttributes: ['name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                category: CollectionFactory.create('category', {
                    uniqueAttributes: ['parent_id', 'key'],
                    comparator: function () {
                        return this.get('parent_id') + this.get('key');
                    },
                    displayName: 'value',
                }),
                article: CollectionFactory.create('article', {
                    uniqueAttributes: ['organization_id', 'name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                article_category: CollectionFactory.create('article_category', {
                    uniqueAttributes: ['article_id', 'category_id'],
                    comparator: 'id',
                    displayName: 'id',
                }),
                article_plant: CollectionFactory.create('article_plant', {
                    uniqueAttributes: ['article_id', 'plant_id'],
                    comparator: 'id',
                    displayName: 'id',
                }),
                user_role: CollectionFactory.create('user_role', {
                    uniqueAttributes: ['user_id'],
                    comparator: 'id',
                    displayName: 'id',
                }),
                role: CollectionFactory.create('role', {
                    uniqueAttributes: ['name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                garden: CollectionFactory.create('garden', {
                    uniqueAttributes: ['name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                block: CollectionFactory.create('block', {
                    uniqueAttributes: ['garden_id', 'name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                bed: CollectionFactory.create('bed', {
                    uniqueAttributes: ['block_id', 'name'],
                    comparator: 'name',
                    displayName: 'name',
                }),
                crop: CollectionFactory.create('crop', {
                    uniqueAttributes: ['article_id', 'number'],
                    comparator: function () {
                        return this.get('article_id') + this.get('number');
                    },
                    displayName: function () {
                        return this.find('article').getDisplayName() + ' ' + this.get('number');
                    },
                }),
                task: CollectionFactory.create('task', {
                    uniqueAttributes: ['crop_id', 'organization_id', 'category_id', 'date'],
                    comparator: 'id',
                    displayName: function () {
                        return this.find('category').get('name');
                    },
                }),
                /*
                implantation: CollectionFactory.create('implantation', {
                    comparator: 'id',
                    displayName: function () {
                        var bed = this.find('bed');
                        var block = bed.find('block');
                        var variety = this.find('crop').find('variety');
                        return block.get('name') + ' ' + bed.get('name') + ' ' + variety.getDisplayName();
                    },
                }),
                snapshot: CollectionFactory.create('snapshot', {
                    comparator: 'date',
                    displayName: function () {
                        return this.find('category').get('name') + ' ' + this.get('type') + ' - ' + this.get('date');
                    },
                }),
                work: CollectionFactory.create('work', {
                    comparator: 'date',
                    displayName: function () {
                        return this.find('task').find('category').get('name') + ' - ' + this.get('date');
                    },
                }),
                flow: CollectionFactory.create('flow', {
                    comparator: 'date',
                    displayName: function () {
                        return this.find('product').get('name') + ' - ' + this.get('date');
                    },
                }),
                photo: CollectionFactory.create('photo', {
                    comparator: 'date',
                    displayName: function () {
                        return this.get('title').length > 0 ? this.get('title') : 'Photo';
                    },
                }),
                product: CollectionFactory.create('product', {comparator: 'name', displayName: 'name'}),
                provider: CollectionFactory.create('provider', {comparator: 'name', displayName: 'name'}),
                pos: CollectionFactory.create('pos', {comparator: 'name', displayName: 'name'}),
                */
            });

            this.fetchFlag = false;
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