'use strict';

define([
    'jquery',
    'underscore',
    'config',
    'factory/factory',
    'view/widget/dialog/model-dialog',
    'http/mutex',
], function ($, _, config, Factory, ModelDialog, Mutex) {

    return Factory.extend({}, {

        create: function(modelName) {
            var modelMutex = false;
            if (config.api.mutex) {
                modelMutex = new Mutex({
                    client: app.client,
                    modelName: modelName,
                });
            }
            return new ModelDialog({
                id: modelName + '-dialog',
                modelForm: app.forms.get(modelName),
                modelMutex: modelMutex,
            });
        },
    });
});