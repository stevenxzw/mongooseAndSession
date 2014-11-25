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
            var config_param = JSON.parse(RMS.config.content);
            var _roomContent  = config_param.r[0];
            console.log(_roomContent);
            $scope.users =_roomContent.users;
            $http.post( '/Api/getRoomChars', {id: config_param.p.id}).success(function(r){
                debugger;
                $scope.chars =_roomContent.chars;
            });


            angular.element(window).bind('load', function() {
                socketInit();
                socket.on('addComment', function(p){
                    console.log(p);
                });
                socket.emit('getenv', {});
            });

           $scope.comment = function(e, obj) {
               var content = angular.element(document.getElementById('comment_text')),
                   text = content.val();
               if(text){
                   socket.emit('sendComment', {text : text, rid : config_param.p.id, uid : config_param.p.user_id }, function(p){
                       console.log(p)
                   });
               }


           }


    }).controller('roomsControl', function($scope, $http) {
            $scope.items = [];
            $scope.roomId = '';
            $scope.roomsModal = angular.element(document.querySelector('#roomsModal'));
            $http.get('/Api/getRoomList').success(function(r){
                $scope.items = r.raw;
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

            //var btn = angular.element(document.querySelector('#loginbtn'));
            setTimeout(function(){document.getElementById('loginbtn').click()}, 1000);
        })


})(angular)