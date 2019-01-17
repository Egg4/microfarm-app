'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
], function ($, _, Page, Header) {

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

        setData: function (id) {
            if (this.model) this.stopListening(this.model);
            this.model = this.collection.get(id);
            this.listenTo(this.model, 'update', this.render);
        },
    });
});