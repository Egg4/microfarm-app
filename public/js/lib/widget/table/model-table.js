'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/table/table',
    'view/widget/bar/header-bar',
    'view/widget/button/button',
    'view/widget/table/row/model-table-row',
], function ($, _, Table, Header, Button, ModelTableRow) {

    return Table.extend({

        initialize: function (options) {
            $.extend(true, this, {
                navigation: false,
                modelName: false,
                modelDialog: false,
                modelMenu: false,
                authorize: false,
                redirect: false,
                addButton: false,
                tableData: false,
                rowTemplate: false,
                rowData: false,
                formData: false,
                formVisibility: false,
                listenToCollections: [],
            }, _.pick(options, 'navigation', 'modelName', 'modelDialog', 'modelMenu', 'authorize', 'redirect', 'addButton', 'tableData', 'rowTemplate', 'rowData', 'formData', 'formVisibility', 'listenToCollections'));

            if (options.header === undefined) {
                var rightButton = false;
                if (this.authorize && this.authorize('add')) {
                    rightButton = new Button({
                        align: 'right',
                        icon: 'plus',
                        events: {
                            click: this.onClickAdd.bind(this),
                        },
                    });
                }
                options.header = new Header({
                    title: options.title || '',
                    icon: options.icon || false,
                    rightButton: rightButton,
                    items: {
                        navigation: this.navigation,
                    }
                });
            }

            Table.prototype.initialize.call(this, $.extend(true, {
                header: options.header || false,
                data: this.tableData,
                bodyRow: ModelTableRow.extend({
                    template: this.rowTemplate,
                    data: this.rowData,
                }),
            }, options));

            if (this.navigation) {
                this.listenTo(this.navigation, 'click', function(item) {
                    this.render({
                        navigationKey: item,
                    });
                }.bind(this));
            }
            if (this.addButton) {
                $(this.addButton.el).on('click', this.onClickAdd.bind(this));
            }

            _.each(this.listenToCollections, function (collection) {
                this.listenTo(collection, 'update', this.render);
            }.bind(this));

            $(this.el).addClass('model-table-widget');
        },

        render: function (options) {
            options = options || {};
            this.parentModel = options.parentModel || this.parentModel;
            this.navigationKey = options.navigationKey || this.navigationKey;

            Table.prototype.render.call(this, {
                data: this.parentModel,
                navigationKey: this.navigationKey,
            });
            if (this.navigation) {
                this.navigation.render({
                    active: this.navigationKey,
                });
            }
        },

        onClickAdd: function () {
            this.modelDialog.show({
                title: 'New ' + this.modelName,
                form: {
                    data: this.formData(this.parentModel),
                    visibility: this.formVisibility(this.parentModel),
                },
            });
        },

        onClickRow: function (model) {
            if (this.authorize && this.authorize('view', model)) {
                if (this.redirect) {
                    this.redirect(model);
                }
            }
        },

        onHoldRow: function (model) {
            if (this.authorize) {
                if (this.authorize('edit', model) || this.authorize('delete', model)) {
                    this.modelMenu.show({
                        model: model,
                        formVisibility: this.formVisibility(this.parentModel),
                    });
                }
            }
        },
    });
});