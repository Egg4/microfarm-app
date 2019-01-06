'use strict';

define([
    'jquery',
    'underscore',
    'config',
    'factory/factory',
    'view/widget/menu/model-menu',
    'view/widget/dialog/model-delete-dialog',
    'http/mutex',
], function ($, _, config, Factory, ModelMenu, ModelDeleteDialog, Mutex) {

    return Factory.extend({}, {

        create: function(modelName) {
            var modelMutex = false;
            if (config.api.mutex) {
                modelMutex = new Mutex({
                    client: app.client,
                    modelName: modelName,
                });
            }
            return new ModelMenu({
                id: modelName + '-menu',
                modelName: modelName,
                modelDialog: app.dialogs.get(modelName),
                modelDeleteDialog: new ModelDeleteDialog({
                    id: modelName + '-delete-dialog',
                    modelName: modelName,
                    modelMutex: modelMutex,
                }),
                authorize: app.authentication.hasRights.bind(app.authentication),
            });
        },
    });
});