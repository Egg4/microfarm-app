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
                        entity_id: 'entity',
                        organization_id: 'organization',
                        category_id: 'category',
                        quantity_unit_id: 'category',
                    },
                    uniqueAttributes: ['organization_id', 'name'],
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