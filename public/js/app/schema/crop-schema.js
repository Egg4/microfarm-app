'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/view/form/crop-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

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
                    uniqueAttributes: ['article_id', 'number'],
                    comparator: function () {
                        return this.get('article_id') + this.get('number');
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