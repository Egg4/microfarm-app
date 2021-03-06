'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/form',
], function ($, _, Form) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, options);

            var defaults = {
                collection: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('model-form-widget');
        },

        validator: function (data) {
            var errors = Form.prototype.validator.call(this, data);
            if (!this.collection.isUnique(data)) {
                var modelName = polyglot.t('model.name.' + this.collection.modelName, {_: this.collection.modelName});
                errors.push({
                    attributes: this.collection.uniqueKey,
                    message: polyglot.t('form.validator.not-unique', {
                        _: '%{model}: this model already exists',
                        model: modelName,
                    }),
                });
            }
            return errors;
        },

        submit: function() {
            var deferred = $.Deferred();
            if (!this.validate()) return deferred.reject();

            var data = this.getData(),
                isNew = (_.isUndefined(data.id) || !parseInt(data.id));

            if (isNew) {
                this.collection.create(_.omit(data, 'id'), {
                    success: deferred.resolve,
                    error: deferred.reject,
                });
            }
            else {
                this.collection.get(data.id).save(data, {
                    success: deferred.resolve,
                    error: deferred.reject,
                });
            }

            return deferred.promise();
        },
    });
});