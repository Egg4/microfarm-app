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
                        var taskName = this.find('category').getDisplayName().toLowerCase();
                        return polyglot.t('model.name.task') + ' ' + taskName;
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        crop_id: {
                            model: 'crop',
                            onDelete: 'cascade',
                        },
                        output_id: {
                            model: 'output',
                            onDelete: 'cascade',
                        },
                        organization_id: {
                            model: 'organization',
                            onDelete: 'cascade',
                        },
                        category_id: {
                            model: 'category',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['crop_id', 'output_id', 'organization_id', 'category_id', 'date'],
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