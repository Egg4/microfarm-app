'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/photo-form-element',
], function ($, _, Form, FormGroup, InputHidden, Photo) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                collection: app.collections.get('photo'),
                formGroup: new FormGroup({
                    items: [
                        new InputHidden({
                            name: 'id',
                            required: false,
                            cast: 'integer',
                        }),
                        new InputHidden({
                            name: 'entity_id',
                            cast: 'integer',
                        }),
                        new InputHidden({
                            name: 'task_id',
                            cast: 'integer',
                        }),
                        new Photo({
                            name: 'url',
                            events: {
                                click: function() {
                                    this.openCameraDialog();
                                }.bind(this),
                            },
                        }),
                    ],
                }),
            });
        },

        render: function () {
            var urlElement = this.getElement('url');

            Form.prototype.render.call(this);

            if (_.isEmpty(urlElement.getValue())) {
                setTimeout(this.openCameraDialog.bind(this), 200);
            }
        },

        openCameraDialog: function () {
            app.dialogs.get('camera').open()
                .done(function (url) {
                    var urlElement = this.getElement('url');
                    urlElement.setValue(url);
                    urlElement.render();
                }.bind(this))
                .fail(function (error) {
                    if (error) {
                        app.error({
                            name: error.name,
                            description: error.message,
                        });
                    }
                });
        },
    });
});