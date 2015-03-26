/*jshint -W098 */
/*jshint -W030 */
/*jshint -W116 */
/*globals angular, tinycolor*/
(function () {
    "use strict";

    var databaseUrl = "http://terra.lcg.ufrj.br/~lfgoncalves/prourb/index.php";

    var app = angular.module('ConsorciosApp', ['ngRoute']);

    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider

        // route for the sobre page
            .when('/sobre', {
            templateUrl: 'pages/sobre.html'
        })

        // route for the consorcios page
        .when('/consorcios', {
            templateUrl: 'pages/consorcios.html',
            controller: 'ConsorciosController',
            controllerAs: 'consorciosCtrl'
        })

        // route for each consorcio page
        .when('/consorcio/:consorcioId', {
            templateUrl: 'pages/consorcios.html',
            controller: 'ConsorciosController',
            controllerAs: 'consorciosCtrl'
        })

        // route for the about page
        .when('/publicacoes', {
            templateUrl: 'pages/publicacoes.html'
        })

        // route for the contact page
        .when('/contato', {
            templateUrl: 'pages/contato.html'
        })



        .otherwise({
            redirectTo: ''
        });

        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    });


    // Class Consorcio
    app.factory('ConsorciosList', ["$http", "Consorcio", '$filter', function ($http, Consorcio, $filter) {

        //Constructor
        function ConsorciosList() {}
        var items = [],
            current = {},
            localizationId = "";

        //$http.jsonp(databaseUrl+"/consorcio/buscarTodosConsorcios?callback=JSON_CALLBACK").success(function (data) {
        $http.get("/consorcios.json").success(function (data) {

            angular.forEach(data, function (object) {
                items.push(Consorcio.build(object));
            });
            console.log(items);
            if (localizationId) {
                console.log("setLocalizationId " + localizationId);
                angular.copy($filter('getById')(items, localizationId), current);
            }
        }).error(function () {
            console.log("Error getting consorcios");
        });

        ConsorciosList.getItems = function () {
            console.log("get Items");
            return items;
        };

        ConsorciosList.getCurrent = function () {
            console.log("get Current");
            return current;
        };

        ConsorciosList.setCurrent = function (consorcio) {
            current = consorcio;
            localizationId = "";
        };

        ConsorciosList.getLocalizationId = function () {
            return localizationId;
        };

        ConsorciosList.setLocalizationId = function (id) {
            console.log("settinglocalizationid");
            localizationId = id;
            if(current.id !== id)
                angular.copy($filter('getById')(items, localizationId), current);
        };

        ConsorciosList.localizationIdIsValid = function (id){
            if($filter('getById')(items, id))
                return true;
            else if(!localizationId)
                return true;
            else {
                localizationId = "";
                current = {};
                return false;
            }
        };

        return ConsorciosList;

    }]);


    // Class Consorcio
    app.factory('Consorcio', function (Estado) {

        //Constructor
        function Consorcio() {}

        Consorcio.build = function (data) {

            var consorcio = new Consorcio();
            angular.extend(consorcio, data);

            for (var i = 0; i < consorcio.estados.length; i++) {
                consorcio.estados[i] = Estado.build(consorcio.estados[i]);
            }

            return consorcio;
        };
        return Consorcio;
    });

    //Class Estado
    app.factory('Estado', ['$http', function ($http) {

        //Constructor
        function Estado() {}
        var estados = [];

        //$http.jsonp(databaseUrl+"/estado/buscarTodosEstados?callback=JSON_CALLBACK").success(function (data) {
        $http.get("/estados.json").success(function (data) {

            angular.forEach(data, function (object) {
                estados.push(object.uf);
            });
            console.log(estados);

        }).error(function () {
            console.log("Error getting estados");
        });

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

        Estado.getEstados = function () {
            return estados;
        };

        return Estado;
    }]);




    app.controller("ConsorciosController", ["$http", '$routeParams','$location', "ConsorciosList", 'Estado', function ($http, $routeParams, $location, ConsorciosList, Estado) {

        var ctrl = this;
        ctrl.consorcios = ConsorciosList.getItems();
        ctrl.estados = Estado.getEstados();
        ctrl.current = ConsorciosList.getCurrent();

              //  console.log("routeId ", $routeParams.consorcioId);
        if($routeParams.consorcioId && ConsorciosList.localizationIdIsValid($routeParams.consorcioId) )
            ConsorciosList.setLocalizationId($routeParams.consorcioId);
        else if( $location.path() !== "/consorcios")
            $location.path("/consorcios");

        if($location.path() === "/consorcios" && ConsorciosList.getLocalizationId() != "")
           {$location.path("/consorcio/"+ConsorciosList.getLocalizationId());}

        ctrl.setCurrent = function (consorcio) {
            ctrl.current = consorcio;
            ConsorciosList.setCurrent(consorcio);
            $location.path(consorcio ? "/consorcio/"+consorcio.id : "/consorcios");
        };

        ctrl.print = function(){
            console.log("ctrlCurrent ", ctrl.current);
            console.log("CLCurrent ", ConsorciosList.getCurrent());


        };

    }]);

    app.filter('getById', function () {

        console.log("getById");
        return function (input, id) {
            var i = 0,
                len = input.length;
            for (; i < len; i++) {
                if (+input[i].id === +id) {
                    console.log("found!");
                    return input[i];
                }
            }
            return null;
        };
    });


    app.filter('estadosFilter', [function () {
        return function (consorcios, myParam) {
            myParam = myParam || "";
            if (myParam === "") {
                return consorcios;
            }
            var result = {};

            angular.forEach(consorcios, function (consorcio, key) {
                angular.forEach(consorcio.estados, function (estado) {
                    if (estado.uf === myParam) {
                        result[key] = consorcio;
                    }
                });
            });

            return result;
        };
}]);




})();
