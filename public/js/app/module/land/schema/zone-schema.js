'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/land/form/zone-form',
    'app/widget/dialog/model-dialog',
    'app/module/land/page/zone-page',
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
                        category_id: {
                            model: 'category',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['name'],
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
                        pattern: 'zone/:id',
                    }],
                },
            });
        },
    });
});