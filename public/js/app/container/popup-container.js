'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/view/popup/error-popup',
    'app/view/popup/confirm-popup',
    'app/view/popup/delete-popup',
    'app/view/popup/menu-popup',
], function ($, _, Container,
             ErrorPopup,
             ConfirmPopup,
             DeletePopup,
             MenuPopup
) {

    return Container.extend({

        initialize: function () {
            Container.prototype.initialize.call(this, {
                error: function () {
                    return new ErrorPopup();
                },
                confirm: function () {
                    return new ConfirmPopup();
                },
                delete: function () {
                    return new DeletePopup();
                },
                menu: function () {
                    return new MenuPopup();
                },
            });
        },

        closeAll: function () {
            var deferred = $.Deferred();

            var promises = [];
            this.each(function(popup) {
                if (popup.isOpened()) {
                    promises.push(popup.close());
                }
            });

            $.when.apply($, promises).done(function() {
                deferred.resolve();
            }.bind(this));

            return deferred.promise();
        },
    });
});