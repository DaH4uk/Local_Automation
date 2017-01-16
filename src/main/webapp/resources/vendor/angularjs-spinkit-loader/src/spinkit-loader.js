'use strict'

angular.module('spinkitLoader', ['ng', 'Gdo'])
	.directive('ngLoader', [ '$templateCache', function($templateCache) {
		return {
      restrict: 'AE',
      scope: {
        settings: '='
      },
      template: '<ng-include class="{{_settings.containerClass}}" ng-show="showLoader" src="getTemplateUrl()"/>',
      link: function ($scope, $element, $attrs) {
        var SpinKitClasses = [
          'sk-rotating-plane',
          'sk-double-bounce',
          'sk-wave',
          'sk-wandering-cubes',
          'sk-spinner-pulse',
          'sk-chasing-dots',
          'sk-three-bounce',
          'sk-circle',
          'sk-cube-grid',
          'sk-fading-circle',
          'sk-folding-cube'
        ];

        $scope._settings = {
          spinkit: 'sk-rotating-plane',
          class: '',
          containerClass: 'loader-container'
        };
        angular.extend($scope._settings, $scope.settings || []);

        $scope.getTemplateUrl = function() {
          if(SpinKitClasses.indexOf($scope._settings.spinkit) == -1)
            return 'sk-rotating-plane.html';

          return $scope._settings.spinkit + '.html'
        };

        $scope.showLoader = false;

        $scope.$on('ajax-loader:show', function () {
          $scope.showLoader = true;
        });

        $scope.$on('ajax-loader:hide', function () {
          $scope.showLoader = false;
        });

        return $scope;

      }
    }
	}])

  .factory('httpInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
    var numRequests = 0;

    return {
      request: function (config) {
        numRequests++;
        $rootScope.$broadcast('ajax-loader:show');

        return config || $q.when(config);
      },
      response: function (response) {
        if ((--numRequests) === 0) {
          $rootScope.$broadcast('ajax-loader:hide');
        }

        return response || $q.when(response);
      },
      responseError: function (response) {
        if ((--numRequests) === 0) {
          $rootScope.$broadcast('ajax-loader:hide');
        }

        return $q.reject(response);
      }
    };
  }])

  .config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  }]);