'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/factory/model-menu-factory',
], function ($, _, Container, ModelMenuFactory) {

    return Container.extend({

        initialize: function (options) {
            Container.prototype.initialize.call(this, $.extend(true, {
                variety: function () {
                    return ModelMenuFactory.create('variety');
                },
                organization: function () {
                    return ModelMenuFactory.create('organization');
                },
                article: function () {
                    return ModelMenuFactory.create('article');
                },
                article_category: function () {
                    return ModelMenuFactory.create('article_category');
                },
                article_plant: function () {
                    return ModelMenuFactory.create('article_plant');
                },
                garden: function () {
                    return ModelMenuFactory.create('garden');
                },
                block: function () {
                    return ModelMenuFactory.create('block');
                },
                bed: function () {
                    return ModelMenuFactory.create('bed');
                },
                /*
                implantation: function () {
                    return ModelMenuFactory.create('implantation');
                },
                crop: function () {
                    return ModelMenuFactory.create('crop');
                },
                snapshot: function () {
                    return ModelMenuFactory.create('snapshot');
                },
                task: function () {
                    return ModelMenuFactory.create('task');
                },
                work: function () {
                    return ModelMenuFactory.create('work');
                },
                flow: function () {
                    return ModelMenuFactory.create('flow');
                },
                photo: function () {
                    return ModelMenuFactory.create('photo');
                },
                product: function () {
                    return ModelMenuFactory.create('product');
                },
                provider: function () {
                    return ModelMenuFactory.create('provider');
                },
                pos: function () {
                    return ModelMenuFactory.create('pos');
                },
                */
            }, options));
        },
    });
});