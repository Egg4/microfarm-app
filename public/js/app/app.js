'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'app/container/schema-container',
    'app/container/collection-container',
    'app/container/dialog-container',
    /*
    'app/container/menu-container',
    'app/container/panel-container',
    */
    'app/container/page-container',
    'app/widget/loader/loader',
    'lib/http/client',
    'app/http/authentication',
    'app/router',
    'app/config',
], function ($, _, Backbone,
             SchemaContainer,
             CollectionContainer,
             DialogContainer,
             /*
             MenuContainer,
             PanelContainer,
             */
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
            this.client = new Client({
                url: config.api.url,
                headers: {
                    'Accept': config.api.mime || undefined,
                    'Content-Type': config.api.mime || undefined,
                    'Content-Encoding': config.api.encoding || undefined,
                },
                timeout: config.api.timeout,
                errorHandler: this.onClientError.bind(this),
            });
            this.authentication = new Authentication({
                client: this.client,
                authorization: config.authorization,
            });
            this.router = new Router();
            this.schemas = new SchemaContainer();
            this.collections = new CollectionContainer({
                schemas: this.schemas,
            });
            this.dialogs = new DialogContainer({
                schemas: this.schemas,
            });
            //this.menus = new MenuContainer();
            //this.panels = new PanelContainer();
            this.pages = new PageContainer({
                schemas: this.schemas,
                router: this.router,
            });
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
                this.dialogs.closeAll().done(function() {
                    this.dialogs.get('error').show({
                        title: 'Error',
                        errors: errors,
                    });
                }.bind(this));
            }
        },
    });
});