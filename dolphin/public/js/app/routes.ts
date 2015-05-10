///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
///<reference path="../../../scripts/typings/angularjs/angular-route.d.ts"/>

'use strict';

angular.module('dolphin').config(['$routeProvider', ($routeProvider:angular.route.IRouteProvider):any=> {
    $routeProvider.when('/', {
        templateUrl: 'views/_article-sources.html',
        controller: 'MainController'
    });
    console.log($routeProvider);
}]);