/**
 * @license Async Template directive
 * (c) 2013 Josef Zamrzla josef.zamrzla(at)gmail.com
 * License: MIT
 */
(function (angular) {
    'use strict';

    var app = angular.module('asyncTemplateModule', ['ngResource']);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

    app.directive('asyncTemplate', ['$compile', '$http', '$resource', '$templateCache', function ($compile, $http, $resource, $templateCache) {

        function attrNameIsNotReserved (name) {
            var reserved = ['template', 'errorTemplate', 'endpoint', 'jsonp', 'isArray',
                            'reloadInterval', 'observe', 'style', 'id', 'class'];
            return reserved.indexOf(name) === -1;
        }

        return {
            restrict: 'EA',
            replace:true,
            scope: {},
            compile: function (tElement, tAttrs) {
                // attach attrs to scope
                var attrsCount = 0;
                for (var property in tAttrs.$attr) {
                    if (tAttrs.hasOwnProperty(property) ){
                        this.scope[property] = '@';
                        ++attrsCount;
                    }
                }

                return function link (scope, element, attrs) {

                    var fired = false, intervalId = null;
                    var templateLoader, templateText, reloadTemplate = false;
                    var  initializedAttrs = 0;

                    var tplURL = attrs.template;
                    templateLoader = $http.get(tplURL, {cache: $templateCache})
                        .success(function (html) {
                            templateText = html;
                            element.html(html);
                            $compile(element.contents())(scope);
                        })
                        .error(function (err) {
                            console.log('Cannot load template: ' + tplUrl);
                        });

                    // observe all attributes by default
                    var propsToObserve = attrs.$attr;
                    // if limited list of attrs is set, observe only them
                    if (attrs.observe) {
                        var limitedAttrs = attrs.observe.split(/[, ]+/);
                        if (limitedAttrs.length) {
                            propsToObserve = {};
                            attrsCount = 0;
                            for (var i in limitedAttrs) {
                                propsToObserve[limitedAttrs[i]] = limitedAttrs[i];
                                ++attrsCount;
                            }
                        }
                    }

                    function attributeValueChanged (value) {
                        // do not fire loadContent until all attributes are initialized !!!
                        // otherwise it'll cause multiple requests
                        if (value !== undefined) {
                            ++initializedAttrs;
                        }

                        if (initializedAttrs >= attrsCount) {
                            setTimeout(initContent);
                            fired = true;
                        }
                    }

                    for (var property in propsToObserve) {
                        if (attrs.hasOwnProperty(property)) {
                            attrs.$observe(property, attributeValueChanged);
                        }
                    }

                    // if no custom attrs found
                    if (!attrsCount) {
                        setTimeout(initContent);
                        fired = true;
                    }

                    // load content directly or set interval to load content periodically
                    function initContent () {
                        if (attrs.reloadInterval) {
                            if (intervalId) {
                                clearInterval(intervalId);
                            }

                            intervalId = setInterval(loadContent, attrs.reloadInterval);
                        } else {
                            loadContent();
                        }
                    }

                    // load data from endpoint and set it to scope
                    function loadContent() {

                        // copy current attrs only
                        var requestParams = {};
                        for (var property in attrs.$attr) {
                            if (attrs.hasOwnProperty(property) && attrNameIsNotReserved(property)) {
                                requestParams[property] = attrs[property];
                            }
                        }

                        var resourceParams = {};
                        var methodParams = {
                            method: 'GET',
                            params: requestParams,
                            isArray: (attrs.isArray && attrs.isArray === 'true') || false
                        };

                        if (attrs.jsonp && attrs.jsonp === 'true') {
                            methodParams.method = 'JSONP';
                            resourceParams.callback = 'JSON_CALLBACK';
                        }

                        // reset response data container
                        scope.responseData = undefined;

                        var api = $resource(attrs.endpoint, resourceParams, {get: methodParams});

                        api.get(
                            function success (data) {
                                templateLoader.then(function () {

                                    // re-compile origin template after error template has been set
                                    if (reloadTemplate) {
                                        element.html(templateText);
                                        $compile(element.contents())(scope);
                                        reloadTemplate = false;
                                    }

                                    scope.responseData = data || {};
                                });
                            },
                            function error (err) {
                                if (attrs.errorTemplate) {
                                    $http.get(attrs.errorTemplate, {cache: $templateCache})
                                        .success(function (html) {
                                            // recompile with error tpl
                                            element.html(html);
                                            $compile(element.contents())(scope);
                                            reloadTemplate = true;
                                        })
                                        .error(function (err) {
                                            console.log('Cannot load error template: ' + attrs.errorTemplate);
                                        });
                                }
                            }
                        );

                    }
                };
            }
        };
    }]);

})(angular);