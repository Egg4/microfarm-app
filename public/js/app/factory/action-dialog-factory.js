'use strict';

define([
    'jquery',
    'underscore',
    'factory/factory',
    'view/dialog/action-dialog',
], function ($, _, Factory, ActionDialog) {

    return Factory.extend({}, {

        create: function(actionName) {
            return new ActionDialog({
                id: actionName + '-dialog',
                form: app.forms.get(actionName),
            });
        },
    });
});