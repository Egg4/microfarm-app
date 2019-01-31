'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/basic-production/form/output-form',
    'app/widget/dialog/model-dialog',
    'app/module/basic-production/page/output-page',
], function ($, _, Schema, Model, Collection, Form, Dialog, Page) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        var article = this.find('article'),
                            quantityUnit = article.find('category', {selfAttribute: 'quantity_unit_id'}).get('value');
                        return article.getDisplayName() + ' - ' + this.get('quantity') + ' ' + quantityUnit;
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        task_id: {
                            model: 'task',
                            onDelete: 'cascade',
                        },
                        article_id: {
                            model: 'article',
                            onDelete: 'cascade',
                        },
                        variety_id: {
                            model: 'variety',
                            onDelete: 'set_null',
                        },
                    },
                    uniqueKey: ['task_id', 'article_id', 'variety_id'],
                    comparator: 'id',
                },
                form: {
                    class: Form,
                },
                dialog: {
                    class: Dialog,
                },
                page: {
                    class: Page,
                    routes: [{
                        pattern: 'output/:id',
                    }],
                },
            });
        },
    });
});