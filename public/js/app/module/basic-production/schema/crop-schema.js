'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/basic-production/form/crop-form',
    'app/widget/dialog/model-dialog',
    'app/module/basic-production/page/crop-page',
], function ($, _, Schema, Model, Collection, Form, Dialog, Page) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        return this.find('article').getDisplayName() + ' ' + this.get('number');
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        article_id: {
                            model: 'article',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['article_id', 'number'],
                    comparator: function (crop) {
                        var articleId = crop.get('article_id');
                        var number = crop.get('number');
                        return articleId.pad(4) + '-' + number.pad(4);
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
                        pattern: 'crop/:id',
                    }],
                },
            });
        },
    });
});