/**
 * Created by zhiwen on 14-10-30.
 */
(function(ang){
    var host = 'http://127.0.0.1', socket;

    var socketInit = function(){
        if(typeof io !== 'undefined' && !socket)
            socket = io.connect(host);
    }


    var app = ang.module('app', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    }).filter('vNull', function(){
            return function(v) {
                if(v === '') return '-';
                if(v === undefined) return 0;
                return v;
            };
        }).filter('toTime', function(){
            return function(v){
                return util.timeToDate(v);
            }
        });

    app.controller('MainCtrl', function($scope) {

        $scope.updated = '221';
        console.log(angular.element(document.querySelector('div')));
        $scope.test = function(scope, evt){
            console.log(angular.element(evt.target).addClass('ttt'));
            $scope.updated = '222222222222';
            setTimeout(function(){
                $scope.updated = '1111111111';
                $scope.$apply(function(){
                    console.log(arguments)
                });
            },2000);
            $scope.updated = '333333333333';
        }

    }).controller('usersControl', function($scope, $http) {
            $scope.users = {};
            $http.get('/Api/users').success(function(r){
                $scope.users = r;

            })

    }).controller('roomControl', function($scope, $http) {
            $scope.users = {};
            $scope.chars = [];


            $http.get( '/Api/getRoomUsers').success(function(r){
                $scope.users = r.raw;
            });


    }).controller('roomsControl', function($scope, $http) {
            $scope.items = [];
            $scope.roomId = '';
            $scope.roomsModal = angular.element(document.querySelector('#roomsModal'));
            $http.get('/Api/getRoomList').success(function(r){
                $scope.items = r.raw;
            });

            angular.element(window).bind('load', function() {
                socketInit();
                socket.on('sendenv', function(p){
                    console.log(p);
                });
                socket.emit('getenv', {});
            });

            $scope.itemClick = function(e, obj) {
               if(e.target.tagName.toLocaleLowerCase() === 'a'){
                   e.preventDefault();
                    //$scope.roomsModal.addClass('hidden');
                    location.href = '/room/'+ e.target.rel;
               }
            }

    }).controller('loginControl', function($scope, $http) {
            $scope.user = {
                username : '',
                pwd : '',
                remember: true
            };
            $scope.login = function(u){
                if(u.username && u.pwd){
                    $http.post('/Api/login', u).success(function(r){
                        if(r.err === 0){
                            location.href = '/roomlist';
                        }
                        $scope.users = r;

                    });

                }
                console.log(u);
            }

        })


})(angular)