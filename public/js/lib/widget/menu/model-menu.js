'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/menu/menu',
    'view/widget/button/button',
], function ($, _, Menu, Button) {

    return Menu.extend({

        initialize: function (options) {
            $.extend(true, this, {
                modelName: false,
                modelDialog: false,
                modelDeleteDialog: false,
                authorize: false,
            }, _.pick(options, 'modelName', 'modelDialog', 'modelDeleteDialog', 'authorize'));

            var items = {};
            if (this.authorize && this.authorize(this.modelName, 'edit')) {
                items.edit = new Button({
                    icon: 'pencil-alt',
                    text: 'Edit',
                    events: {
                        click: function () {
                            this.close().done(this.onEdit.bind(this));
                        }.bind(this),
                    },
                });
            }
            if (this.authorize && this.authorize(this.modelName, 'delete')) {
                items.delete = new Button({
                    icon: 'trash-alt',
                    text: 'Delete',
                    events: {
                        click: function () {
                            this.close().done(this.onDelete.bind(this));
                        }.bind(this),
                    },
                });
            }

            Menu.prototype.initialize.call(this, $.extend(true, {
                items: items,
            }, options));
        },

        render: function (options) {
            options = options || {};
            this.model = options.model || this.model;
            this.formVisibility = options.formVisibility || {};

            Menu.prototype.render.call(this);
            this.header.render({
                title: this.model.getDisplayName(),
            });
        },

        onEdit: function () {
            this.modelDialog.show({
                title: 'Edit ' + this.modelName,
                form: {
                    data: this.model.toJSON(),
                    visibility: this.formVisibility,
                },
            });
        },

        onDelete: function () {
            this.modelDeleteDialog.show({
                modelName: this.modelName,
                model: this.model,
            });
        },
    });
});