'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/basic-production/form/article-form',
    'app/widget/dialog/model-dialog',
    'app/module/basic-production/page/article-page',
], function ($, _, Schema, Model, Collection, Form, Dialog, Page) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: 'name',
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        organization_id: {
                            model: 'organization',
                            onDelete: 'cascade',
                        },
                        category_id: {
                            model: 'category',
                            onDelete: 'cascade',
                        },
                        quantity_unit_id: {
                            model: 'category',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['organization_id', 'name'],
                    comparator: 'name',
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
                        pattern: 'article/:id',
                    }],
                },
            });
        },
    });
});