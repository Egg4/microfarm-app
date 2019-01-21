'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/basic-production/form/task-form',
    'app/widget/dialog/model-dialog',
    'app/module/basic-production/page/task-page',
], function ($, _, Schema, Model, Collection, Form, Dialog, Page) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        return this.find('category').getDisplayName();
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        entity_id: 'entity',
                        crop_id: 'crop',
                        output_id: 'output',
                        organization_id: 'organization',
                        category_id: 'category',
                    },
                    uniqueAttributes: ['crop_id', 'output_id', 'organization_id', 'category_id', 'date', 'time'],
                    comparator: function (task) {
                        return task.get('date') + task.get('time');
                    },
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
                        pattern: 'task/:id',
                    }],
                },
            });
        },
    });
});