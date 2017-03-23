'use strict';

myapp.service('Session', function () {
    this.create = function (data) {
        this.id = data.id;
        this.login = data.login;
        this.firstName = data.firstName;
        this.lastName = data.familyName;
        this.email = data.email;
        this.userRoles = [];
        angular.forEach(data.authorities, function (value, key) {
            this.push(value.name);
        }, this.userRoles);
    };
    this.invalidate = function () {
        this.id = null;
        this.login = null;
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.userRoles = null;
    };
    return this;
});


myapp.service('AuthSharedService', function ($rootScope, $http, $resource, authService, Session) {
    return {
        login: function (userName, password, rememberMe) {
            var config = {
                ignoreAuthModule: 'ignoreAuthModule',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            $http.post('authenticate', $.param({
                username: userName,
                password: password,
                rememberme: rememberMe
            }), config)
                .success(function (data, status, headers, config) {
                    authService.loginConfirmed(data);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.authenticationError = true;
                    Session.invalidate();
                });
        },
        getAccount: function () {
            $rootScope.loadingAccount = true;
            $http.get('security/account')
                .then(function (response) {
                    authService.loginConfirmed(response.data);
                });
        },
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                if (authorizedRoles == '*') {
                    return true;
                }
                authorizedRoles = [authorizedRoles];
            }
            var isAuthorized = false;
            angular.forEach(authorizedRoles, function (authorizedRole) {
                var authorized = (!!Session.login &&
                Session.userRoles.indexOf(authorizedRole) !== -1);
                if (authorized || authorizedRole == '*') {
                    isAuthorized = true;
                }
            });
            return isAuthorized;
        },
        logout: function () {
            $rootScope.authenticationError = false;
            $rootScope.authenticated = false;
            $rootScope.account = null;
            $http.get('logout');
            Session.invalidate();
            authService.loginCancelled();
        }
    };
});

myapp.service('HomeService', function ($log, $resource) {
    return {
        getTechno: function () {
            var userResource = $resource('resources/json/techno.json', {}, {
                query: {method: 'GET', params: {}, isArray: true}
            });
            return userResource.query();
        }
    }
});


myapp.service('UsersService', function ($log, $resource) {
    return {
        getAll: function () {
            var userResource = $resource('users', {}, {
                query: {method: 'GET', params: {}, isArray: true}
            });
            return userResource.query();
        }
    }
});

myapp.service('DataService', function ($log, $resource) {
    return {
        getKaratData: function () {
            var karatResource = $resource('data', {}, {
                query: {method: 'GET', params: {element: 'karat_data'}, isArray: true}
            });
            return karatResource.query();
        },
        getSauterDayTemp: function () {
            var sauterResourse = $resource('data', {}, {
                query: {method: 'GET', params: {element: 'sauter_read_day_sp_rk1'}, isArray: true}
            });
            return sauterResourse.query();
        },
        getSauterNightTemp: function () {
            var sauterResourse = $resource('data', {}, {
                query: {method: 'GET', params: {element: 'sauter_read_night_sp_rk1'}, isArray: true}
            });
            return sauterResourse.query();
        },
        getSauterCoilVal: function () {
            var sauterResourse = $resource('data', {}, {
                query: {method: 'GET', params: {element: 'sauter_read_coil'}, isArray: true}
            });
            return sauterResourse.query();
        },
        setSauterDayVal: function (val) {
            var sauterResourse = $resource('set_data', {}, {
                query: {method: 'GET', params: {element: "day_setpoint_rk1", val: val}, isArray: false}
            });
            return sauterResourse.query();
        },
        setSauterNightVal: function (val) {
            var sauterResourse = $resource('set_data', {}, {
                query: {method: 'GET', params: {element: "night_setpoint_rk1", val: val}, isArray: false}
            });
            return sauterResourse.query();
        },
        setSauterCoilVal: function (val) {
            var sauterResourse = $resource('set_data', {}, {
                query: {method: 'GET', params: {element: "write_coil_57", val: val}, isArray: false}
            });
            return sauterResourse.query();
        },
        setSauterControlVal: function (val) {
            var sauterResourse = $resource('set_data', {}, {
                query: {method: 'GET', params: {element: "control_rk1", val: val}, isArray: false}
            });
            return sauterResourse.query();
        }
    }
});

myapp.service('TokensService', function ($log, $resource) {
    return {
        getAll: function () {
            var tokensResource = $resource('security/tokens', {}, {
                query: {method: 'GET', params: {}, isArray: true}
            });
            return tokensResource.query();
        }
    }
});

myapp.service('SchemeService', function ($log, $resource, $http) {
    return {
        getNodes: function () {
                var nodesResource = $resource('scheme/nodes', {}, {
                    query: {method: 'GET', params: {}, isArray: true}
                });
                return nodesResource.query();
        },
        getLinks: function () {
            var linksResource = $resource('scheme/links', {}, {
                query: {method: 'GET', params: {}, isArray: true}
            });
            return linksResource.query();
        },
        getImagesIds: function () {
            var imagesResource = $resource('scheme/getImageIds/', {}, {
                query: {method: 'GET', params: {}, isArray: true}
            });
            return imagesResource.query();
        }
    }
});


