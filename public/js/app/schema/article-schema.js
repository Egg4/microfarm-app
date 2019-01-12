'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/view/form/article-form',
    'app/widget/dialog/model-dialog',
    //'lib/widget/menu/model-menu',
    'app/view/page/article-page',
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
                    uniqueAttributes: ['organization_id', 'name'],
                    comparator: 'name',
                },
                form: {
                    class: Form,
                },
                dialog: {
                    class: Dialog,
                },
                /*
                menu: {
                    class: Menu,
                },
                */
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