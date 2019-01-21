'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Icon) {

    return Page.extend({

        initialize: function (options) {
            var defaults = {
                title: '',
                icon: false,
                collection: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Page.prototype.initialize.call(this, $.extend(true, {
                header: this.buildHeader.bind(this),
            }, options));
        },

        buildHeader: function () {
            return new Header({
                title: this.title,
                icon: this.icon,
                back: true,
                menu: app.panels.get('main-menu'),
            });
        },

        openEditionDialog: function (options) {
            options = $.extend(true, {
                formVisible: {},
            }, options);
            var dialog = app.dialogs.get(this.collection.modelName);
            dialog.setData({
                title: polyglot.t('model-dialog.title.edit', {
                    model: polyglot.t('model.name.' + this.collection.modelName).toLowerCase(),
                }),
                icon: new Icon({name: 'pencil-alt'}),
            });
            dialog.form.setData(this.model.toJSON());
            dialog.form.setVisible(options.formVisible);
            return dialog.open();
        },

        openDeletionPopup: function () {
            var popup = app.popups.get('delete');
            popup.setData({
                model: this.model,
            });
            return popup.open();
        },

        setData: function (id) {
            if (this.model) this.stopListening(this.model);
            this.model = this.collection.get(id);
            this.listenTo(this.model, 'update', this.render);
        },
    });
});