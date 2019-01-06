'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'article-page',
                header: new Header({
                    title: polyglot.t('article-page.title'),
                    icon: new Icon({name: 'tag'}),
                    back: true,
                }),
            });
        },

        setData: function (args) {
            console.log('coucou', args);
        },
    });
});