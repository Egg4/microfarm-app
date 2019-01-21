'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/module/basic-production/basic-production-module',
    'app/module/core/core-module',
    'app/module/taxonomy/taxonomy-module',
], function ($, _, Container,
             BasicProductionModule,
             CoreModule,
             TaxonomyModule
) {
    return Container.extend({

        initialize: function () {
            Container.prototype.initialize.call(this, {
                'basic-production': new BasicProductionModule(),
                'core': new CoreModule(),
                'taxonomy': new TaxonomyModule(),
            });

            this.checkDependencies();
            this.schemas = this.buildSchemaContainer();
        },

        checkDependencies: function () {
            this.each(function (module, name) {
                _.each(module.dependencies, function (depName) {
                    if (!this.has(depName)) {
                        throw new Error('Module "' + name + '" require module "' + depName + '"');
                    }
                }.bind(this));
            }.bind(this));
        },

        buildSchemaContainer: function () {
            var container = new Container();

            this.each(function (module) {
                _.each(module.schemas, function (schema, key) {
                    if (container.has(key)) {
                        throw new Error('Schema "' + key + '" already set');
                    }
                    container.set(key, schema);
                });
            });

            return container;
        },
    });
});