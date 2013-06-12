(function (angular) {
    'use strict';

    var app = angular.module('asyncTplTest', ['asyncTemplateModule']);

    app.controller('simpleUsageCtrl', function ($scope) {});

    app.controller('bindingToScopeCtrl', function ($scope) {
        $scope.user = 1;
        $scope.showTags = 1;

        $scope.getUserId = function () {
            return $scope.user;
        };
    });

    app.controller('reloadingCtrl', function ($scope) {
        $scope.subject = 'number';
        $scope.interval = 2000;

    });
})(angular);