'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/view/panel/menu-panel',
    'app/view/panel/camera-panel',
], function ($, _, Container,
             MenuPanel,
             CameraPanel
) {

    return Container.extend({

        initialize: function (options) {
            Container.prototype.initialize.call(this, $.extend(true, {
                menu: function () {
                    return new MenuPanel();
                },
                camera: function () {
                    return new CameraPanel();
                },
            }, options));
        },
    });
});