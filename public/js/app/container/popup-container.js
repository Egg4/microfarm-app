'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/factory/model-dialog-factory',
    'app/factory/action-dialog-factory',
    'lib/widget/dialog/confirm-dialog',
    'lib/widget/dialog/error-dialog',
], function ($, _, Container, ModelDialogFactory, ActionDialogFactory,
             ConfirmDialog,
             ErrorDialog
) {

    return Container.extend({

        initialize: function (options) {
            Container.prototype.initialize.call(this, $.extend(true, {
                confirm: function () {
                    return new ConfirmDialog({id: 'confirm-dialog'});
                },
                error: function () {
                    return new ErrorDialog({id: 'error-dialog'});
                },
                variety: function () {
                    return ModelDialogFactory.create('variety');
                },
                organization: function () {
                    return ModelDialogFactory.create('organization');
                },
                article: function () {
                    return ModelDialogFactory.create('article');
                },
                article_category: function () {
                    return ModelDialogFactory.create('article_category');
                },
                article_plant: function () {
                    return ModelDialogFactory.create('article_plant');
                },
                garden: function () {
                    return ModelDialogFactory.create('garden');
                },
                block: function () {
                    return ModelDialogFactory.create('block');
                },
                bed: function () {
                    return ModelDialogFactory.create('bed');
                },
                /*
                implantation: function () {
                    return ModelDialogFactory.create('implantation');
                },
                crop: function () {
                    return ModelDialogFactory.create('crop');
                },
                snapshot: function () {
                    return ModelDialogFactory.create('snapshot');
                },
                task: function () {
                    return ModelDialogFactory.create('task');
                },
                work: function () {
                    return ModelDialogFactory.create('work');
                },
                flow: function () {
                    return ModelDialogFactory.create('flow');
                },
                photo: function () {
                    return ModelDialogFactory.create('photo');
                },
                product: function () {
                    return ModelDialogFactory.create('product');
                },
                provider: function () {
                    return ModelDialogFactory.create('provider');
                },
                pos: function () {
                    return ModelDialogFactory.create('pos');
                },
                'crop-report': function () {
                    return ActionDialogFactory.create('crop-report');
                },
                'task-report': function () {
                    return ActionDialogFactory.create('task-report');
                },
                'seed-pocket': function () {
                    return ActionDialogFactory.create('seed-pocket');
                },
                */
            }, options));
        },

        closeAll: function () {
            var deferred = $.Deferred();

            var promises = [];
            this.each(function(dialog) {
                if (dialog.isOpened()) {
                    promises.push(dialog.close());
                }
            });

            $.when.apply($, promises).done(function() {
                deferred.resolve();
            }.bind(this));

            return deferred.promise();
        },
    });
});