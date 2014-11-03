/**
 * Created by zhiwen on 14-10-30.
 */
(function(ang){

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
        });

        });


})(angular)