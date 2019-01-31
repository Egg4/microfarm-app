'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'app/module/core/model/category-model',
    'app/module/core/collection/category-collection',
], function ($, _, Schema, Model, Collection) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: 'value',
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        parent_id: {
                            model: 'category',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['parent_id', 'key'],
                    comparator: function (category) {
                        var parentId = _.isNull(category.get('parent_id')) ? 0 : category.get('parent_id');
                        var sort = category.get('sort');
                        return parentId.pad(4) + '-' + sort.pad(4);
                    },
                },
            });
        },
    });
});