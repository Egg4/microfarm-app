'use strict';

define([
    'jquery',
    'underscore',
    'factory/factory',
    'view/widget/table/model-table',
], function ($, _, Factory, ModelTable) {

    return Factory.extend({}, {

        create: function(modelName, options) {
            options = options || {};
            var listenToCollections = [];
            if (options.listenToCollections) {
                _.each(options.listenToCollections, function(collection) {
                    collection = (typeof collection == 'string') ? app.collections.get(collection) : collection;
                    listenToCollections.push(collection);
                });
            }

            return new ModelTable($.extend(true, {
                className: modelName + '-table',
                header: undefined,
                title: '',
                icon: false,
                navigation: false,
                modelName: modelName,
                modelDialog: app.dialogs.has(modelName) ? app.dialogs.get(modelName) : false,
                modelMenu: app.menus.has(modelName) ? app.menus.get(modelName) : false,
                authorize: function (action, model) {
                    return app.authentication.hasRights(modelName, action);
                },
                redirect: function (model) {
                    return app.router.navigate(modelName + '/' + model.get('id'));
                },
                filterable: false,
                filterInput: false,
                addButton: false,
                tableData: false,
                rowTemplate: false,
                rowData: false,
                formData: function () { return {}; },
                formVisibility: function () { return {}; },
                listenToCollections: listenToCollections,
            }, _.pick(options, 'header', 'title', 'icon', 'navigation', 'redirect', 'filterable', 'filterInput', 'addButton', 'tableData', 'rowTemplate', 'rowData', 'formData', 'formVisibility')));
        },
    });
});