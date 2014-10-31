/**
 * Created by zhiwen on 14-10-30.
 */
(function(ang){

    var app = ang.module('app', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
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

    });


})(angular)