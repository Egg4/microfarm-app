'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'app/container/module-container',
    'app/container/collection-container',
    'app/container/dialog-container',
    'app/container/popup-container',
    'app/container/panel-container',
    'app/container/page-container',
    'app/widget/loader/loader',
    'lib/http/client',
    'app/http/authentication',
    'app/router',
    'app/config',
], function ($, _, Backbone,
             ModuleContainer,
             CollectionContainer,
             DialogContainer,
             PopupContainer,
             PanelContainer,
             PageContainer,
             Loader,
             Client,
             Authentication,
             Router,
             config
) {
    return Backbone.View.extend({

        initialize: function () {
            window.app = this; // Set 'app' as global var

            this.config = config;
            this.loader = new Loader();
            this.client = new Client($.extend(true, {
                errorHandler: this.onClientError.bind(this),
            }, config.api));
            this.authentication = new Authentication();
            this.router = new Router();
            this.modules = new ModuleContainer();
            this.collections = new CollectionContainer();
            this.dialogs = new DialogContainer();
            this.popups = new PopupContainer();
            this.panels = new PanelContainer();
            this.pages = new PageContainer();
        },

        run: function () {
            this.modules.register('core');

            if (!this.authentication.isEntitySelected()) {
                this.router.start();
                this.router.navigate('login');
            }
            else {
                var entityId = this.authentication.get('entity_id');
                this.collections.get('entity').fetch({data: {
                    id: entityId,
                    range: '0-1',
                }}).done(function () {
                    this.registerModules();
                    this.collections.fetchAll().done(function() {
                        this.router.start();
                    }.bind(this));
                }.bind(this));
            }
        },

        registerModules: function () {
            var entityId = this.authentication.get('entity_id'),
                entity = this.collections.get('entity').get(entityId),
                moduleNames = this.config.account[entity.get('account')];

            _.each(moduleNames, function (name) {
                this.modules.register(name);
            }.bind(this));
            this.collections.registerForeignKeysHandlers();
        },

        unregisterModules: function () {
            var entityId = this.authentication.get('entity_id'),
                entity = this.collections.get('entity').get(entityId),
                moduleNames = this.config.account[entity.get('account')];

            this.collections.unregisterForeignKeysHandlers();
            _.each(moduleNames, function (name) {
                this.modules.unregister(name);
            }.bind(this));
        },

        onClientError: function (errors) {
            if (errors[0].name == 'authentication_required') {
                this.authentication.clear();
                this.router.navigate('login');
            }
            else {
                this.popups.closeAll().done(function() {
                    var errorPopup = app.popups.get('error');
                    errorPopup.setData({
                        title: 'Erreurs',
                        errors: errors,
                    });
                    errorPopup.open();
                }.bind(this));
            }
        },
    });
});