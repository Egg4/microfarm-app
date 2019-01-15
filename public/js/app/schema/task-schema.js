'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/view/form/task-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

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
            });
        },
    });
});