'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
], function ($, _, Page) {

    return Page.extend({

        initialize: function (options) {
            var defaults = {

            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Page.prototype.initialize.call(this, {
                header: this.buildHeader(),
                body: this.buildBody(),
            });
        },

        buildHeader: function () {
            return false;
        },

        buildBody: function () {
            return false;
        },
    });
});