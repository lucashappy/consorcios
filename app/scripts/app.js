/*jshint -W098 */
/*jshint -W030 */
/*globals angular, tinycolor*/
(function () {
    "use strict";

    var app = angular.module('ConsorciosApp', ['ngRoute']);

    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider

        // route for the sobre page
            .when('/sobre', {
            templateUrl: 'pages/sobre.html',
            controller: 'ConsorciosController'
        })

        // route for the about page
        .when('/consorcios', {
            templateUrl: 'pages/consorcios.html',
            controller: 'ConsorciosController',
            controllerAs: 'consorciosCtrl'
        })

        // route for the about page
        .when('/publicacoes', {
            templateUrl: 'pages/publicacoes.html',
            controller: 'ConsorciosController'
        })

        // route for the contact page
        .when('/contato', {
            templateUrl: 'pages/contato.html',
            controller: 'ConsorciosController'
        })

        .otherwise({
            redirectTo: ''
        });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    });


    // Class Consorcio
    app.factory('Consorcio', function (Estado) {

        //Constructor
        function Consorcio() {}

        Consorcio.build = function (data) {

            var consorcio = new Consorcio();
            angular.extend(consorcio, data);

            for(var i = 0; i< consorcio.estados.length; i++){
                consorcio.estados[i] = Estado.build(consorcio.estados[i]);
            }

            return consorcio;
        };
        return Consorcio;
    });

    //Class Estado
    app.factory('Estado', function () {

        //Constructor
        function Estado() {}

        Estado.build = function (data) {
            var estado = new Estado();
            angular.extend(estado, data);
            estado.color = "#" + tinycolor.fromRatio({
                            h: estado.estado_id / 27.0,
                            s: 0.52,
                            v: 0.68
                        }).toHex();
            return estado;
        };
        return Estado;
    });




    app.controller("ConsorciosController", ["$http", "Consorcio", function ($http, Consorcio) {
        var ctrl = this;
        ctrl.consorcios = [];
        ctrl.estados = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT',
  'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

        $http.jsonp("http://terra.lcg.ufrj.br/~lfgoncalves/prourb/index.php/consorcio/buscarTodosConsorcios?callback=JSON_CALLBACK").success(function (data) {
            // ctrl.consorcios = data;
            console.log("SUCCESS");
            angular.forEach(data, function (object) {
                ctrl.consorcios.push(Consorcio.build(object));
            });
            console.log(ctrl.consorcios);
        }).error(function () {
            console.log("FAIL");
        });

    }]);

    app.filter('estadosFilter', [function () {
        return function (estados, myParam) {
            myParam = myParam || "";
            if (myParam === "") {
                return estados;
            }
            var result = {};

            angular.forEach(estados, function (estado, key) {
               // if (estado.uf.sigla === myParam) {
              //      result[key] = estado;
              //  }
            });
            return result;
        };
}]);




})();
