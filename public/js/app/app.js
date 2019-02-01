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

            this.loader = new Loader();
            this.client = new Client($.extend(true, {
                errorHandler: this.onClientError.bind(this),
            }, config.api));
            this.authentication = new Authentication({
                client: this.client,
            });
            this.router = new Router();
            this.modules = new ModuleContainer();
            this.collections = new CollectionContainer({modules: this.modules});
            this.dialogs = new DialogContainer({modules: this.modules});
            this.popups = new PopupContainer();
            this.panels = new PanelContainer();
            this.pages = new PageContainer({modules: this.modules, router: this.router});
        },

        run: function () {
            var route = window.location.hash.substring(1) || this.router.defaultRoute;
            this.router.start();
            if (this.authentication.isSet() && !_.isNull(app.authentication.getRole())) {
                this.collections.fetchAll().done(function() {
                    this.router.navigate(route);
                }.bind(this));
            }
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