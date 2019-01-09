'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/widget/popup/error-popup',
    'app/widget/popup/confirm-popup',
    'app/widget/popup/delete-popup',
], function ($, _, Container,
             ErrorPopup,
             ConfirmPopup,
             DeletePopup
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