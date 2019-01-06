'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'article_category-form',
                collection: app.collections.get('article_category'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        entity_id: new InputHidden({
                            name: 'entity_id',
                        }),
                        article_id: new InputHidden({
                            name: 'article_id',
                        }),
                        category_id: new Select({
                            name: 'category_id',
                            optgroup: true,
                            cast: 'integer',
                            data: this.buildCategoryData.bind(this),
                        }),
                    },
                }),
            }, options));
        },

        buildCategoryData: function () {
            var data = [];
            var rootCategory = _.first(app.collections.get('category').where({
                parent_id: null,
                key: 'task_category_id',
            }));
            var productionCategory = _.first(app.collections.get('category').where({
                parent_id: rootCategory.get('id'),
                key: 'crop_production',
            }));
            var parentCategories = app.collections.get('category').where({
                parent_id: productionCategory.get('id'),
            });
            _.each(parentCategories, function(parentCategory) {
                var categories = app.collections.get('category').where({
                    parent_id: parentCategory.get('id'),
                });
                _.each(categories, function(category) {
                    data.push({
                        optgroup: parentCategory.getDisplayName(),
                        value: category.get('id'),
                        label: category.getDisplayName(),
                    });
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },
    });
});