'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/module/access/access-module',
    'app/module/basic-production/basic-production-module',
    'app/module/core/core-module',
    'app/module/extra-production/extra-production-module',
    'app/module/land/land-module',
    'app/module/post-production/post-production-module',
    'app/module/taxonomy/taxonomy-module',
    'app/module/trade/trade-module',
], function ($, _, Container,
             AccessModule,
             BasicProductionModule,
             CoreModule,
             ExtraProductionModule,
             LandModule,
             PostProductionModule,
             TaxonomyModule,
             TradeModule
) {
    return Container.extend({

        register: function (name) {
            var module = this.build(name);
            this.set(name, module);

            _.each(module.schemas, function (schema, key) {
                if (schema.collection) {
                    var collection = app.collections.build(key, schema.collection, schema.model);
                    app.collections.set(key, collection);
                }
                if (schema.dialog) {
                    var dialog = app.dialogs.build(key, schema.dialog, schema.form || null);
                    app.dialogs.set(key, dialog);
                }
                if (schema.page) {
                    var page = app.pages.build(key, schema.page);
                    app.pages.set(key, page);
                }
            });
        },

        unregister: function (name) {
            var module = this.get(name);

            _.each(module.schemas, function (schema, key) {
                if (schema.collection) {
                    if (!app.collections.isFunction(key)) {
                        app.collections.get(key).reset();
                    }
                    app.collections.unset(key);
                }
                if (schema.dialog) {
                    if (!app.dialogs.isFunction(key)) {
                        app.dialogs.get(key).remove();
                    }
                    app.dialogs.unset(key);
                }
                if (schema.page) {
                    if (!app.pages.isFunction(key)) {
                        app.pages.get(key).remove();
                    }
                    app.pages.unset(key);
                }
            });

            module.remove();
            this.unset(name);
        },

        build: function (name) {
            switch (name) {
                case 'access':              return new AccessModule();
                case 'basic-production':    return new BasicProductionModule();
                case 'core':                return new CoreModule();
                case 'extra-production':    return new ExtraProductionModule();
                case 'land':                return new LandModule();
                case 'post-production':     return new PostProductionModule();
                case 'taxonomy':            return new TaxonomyModule();
                case 'trade':               return new TradeModule();
                default:
                    throw new Error('Module ' + name + ' not found');
            }
        },

        set: function (name, module) {
            Container.prototype.set.call(this, name, module);
            this.checkModuleDependencies(name, module);
        },

        checkModuleDependencies: function (name, module) {
            _.each(module.dependencies, function (depName) {
                if (!this.has(depName)) {
                    throw new Error('Module "' + name + '" require module "' + depName + '"');
                }
            }.bind(this));
        },
    });
});