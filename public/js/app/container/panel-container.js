'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/view/panel/main-menu-panel',
], function ($, _, Container,
             MenuPanel
) {
    return Container.extend({

        initialize: function () {
            Container.prototype.initialize.call(this, {
                'main-menu': function () {
                    return new MenuPanel();
                },
            });
        },
    });
});