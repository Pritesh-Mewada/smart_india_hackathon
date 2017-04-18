var app = angular.module("uploadimage",['$location']);

app.controller("find",function($scope,$location){
  $scope.pritesh = $location.url();
})
