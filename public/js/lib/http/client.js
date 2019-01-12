'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'pako',
], function ($, _, Backbone, Pako) {

    return Backbone.View.extend({

        initialize: function (options) {
            this.url = options.url || '';
            this.headers = options.headers || {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip',
            };
            this.timeout = options.timeout || 10000;
            this.formatter  = options.formatter || JSON.stringify;
            this.parser  = options.parser || JSON.parse;
            this.errorHandler = options.errorHandler || function(errors) {
                console.log(errors);
            };
            // Bind Backbone.ajax on this client
            Backbone.ajax = this.backboneAjax.bind(this);
        },

        getHeader: function (key) {
            return this.headers[key] || null;
        },

        setHeader: function (key, value) {
            this.headers[key] = value;
        },

        removeHeader: function (key) {
             delete this.headers[key];
        },

        send: function (options) {
            var deferred = $.Deferred();
            var method = options.method || 'GET';
            var url = this.url + options.url;
            var headers = $.extend({}, this.headers, options.headers || {});
            var data = options.data || '';
            if (!_.isString(data)) {
                data = (method == 'GET') ? $.param(data) : this.formatter(options.data);
            }
            if (method != 'GET' && data.length > 0
                && _.has(headers, 'Content-Encoding')
                && headers['Content-Encoding'] == 'gzip')
            {
                data = Pako.gzip(data);
            }

            $.ajax({
                method: method,
                url: url,
                headers: headers,
                data: data,
                processData: false,
                dataType: 'text',
                timeout: options.timeout || this.timeout,
                global: false, // Disabled global events
                success: function (text) {
                    var data = text ? this.parser(text) : null;
                    deferred.resolve(data);
                }.bind(this),
                error: function (xhr) {
                    var data = xhr.responseText.length > 0 ? this.parser(xhr.responseText) : [{
                            name: 'invalid_response',
                            description: 'Http response is empty',
                        }],
                        catchErrors = options.catchErrors || [],
                        caughtErrors = [],
                        uncaughtErrors = [];
                    _.each(data, function(error) {
                        if (_.contains(catchErrors, error.name)) {
                            caughtErrors.push(error);
                        }
                        else {
                            uncaughtErrors.push(error);
                        }
                    });
                    if (uncaughtErrors.length > 0) {
                        this.errorHandler(uncaughtErrors);
                    }
                    deferred.reject(caughtErrors);
                }.bind(this),
            });

            return deferred.promise();
        },

        backboneAjax: function(request) {
            return this.send({
                method: request.type,
                url: request.url,
                data: request.data,
            }).done(request.success).fail(request.error);
        },
    });
});