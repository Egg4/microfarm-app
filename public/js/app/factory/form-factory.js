'use strict';

define([
    'jquery',
    'underscore',
    'factory/factory',
    'view/form/search-form',
], function ($, _, Factory, SearchForm) {

    return Factory.extend({}, {

        create: function(name, options) {
            switch (name) {
                case 'search': return this.createSearch(options);
                default:
                    throw new Error('Form "' + name + '" not found');
            }
        },

        createSearch: function(options) {
            options = options || {};

            return new SearchForm($.extend(true, {
                modelName: false,
                authorize: app.authentication.hasRights.bind(app.authentication),
            }, _.pick(options, 'modelName')));
        },
    });
});