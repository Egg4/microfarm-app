'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'app/widget/form/search-form',
    'app/widget/table/model-table',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, SearchForm, Table, Button, Label, Icon) {

    return Page.extend({

        initialize: function (options) {
            var defaults = {
                title: '',
                icon: false,
                collection: false,
                searchForm: this.buildSearchForm.bind(this),
                onCreationClick: this.openCreationDialog.bind(this),
                tableOptions: {},
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Page.prototype.initialize.call(this, $.extend(true, {
                header: this.buildHeader.bind(this),
                body: this.buildBody.bind(this),
                events: {
                    swipeleft: function() {
                        app.panels.get('main-menu').open();
                    },
                },
            }, options));

            this.listenTo(this.collection, 'update', this.render);
        },

        buildHeader: function () {
            this.searchForm = _.isFunction(this.searchForm) ? this.searchForm() : this.searchForm;
            return new Header({
                title: this.title,
                icon: this.icon,
                back: true,
                menu: app.panels.get('main-menu'),
                bottom: this.searchForm,
            });
        },

        buildSearchForm: function () {
            var buttons = [];
            if (app.authentication.can('create', this.collection.modelName)) {
                buttons.push(this.buildCreationButton());
            }

            return new SearchForm({
                buttons: buttons,
            });
        },

        buildCreationButton: function () {
            return new Button({
                label: new Label({
                    icon: new Icon({name: 'plus'}),
                }),
                events: {
                    click: function () {
                        this.onCreationClick();
                    }.bind(this),
                },
            });
        },

        openCreationDialog: function () {
            var dialog = app.dialogs.get(this.collection.modelName);
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.' + this.collection.modelName).toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            var modelFormData = _.isFunction(this.tableOptions.modelForm.data) ?
                this.tableOptions.modelForm.data() : this.tableOptions.modelForm.data;
            dialog.form.setData(modelFormData);
            var modelFormVisible = _.isFunction(this.tableOptions.modelForm.visible) ?
                this.tableOptions.modelForm.visible() : this.tableOptions.modelForm.visible;
            dialog.form.setVisible(modelFormVisible);
            var modelFormDisabled = _.isFunction(this.tableOptions.modelForm.disabled) ?
                this.tableOptions.modelForm.disabled() : this.tableOptions.modelForm.disabled;
            dialog.form.setDisabled(modelFormDisabled);
            return dialog.open();
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildTable(),
                ],
            });
        },

        buildTable: function () {
            var filterId = this.searchForm.inputSearch.getElementId();

            return new Table($.extend(true, {
                filterId: filterId,
                header: false,
                collection: this.collection,
            }, this.tableOptions));
        },
    });
});