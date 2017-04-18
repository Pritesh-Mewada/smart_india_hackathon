var app= angular.module("display",[]);

app.controller("get_Student",function($scope,$http,$location){
  $scope.i = 0;
  $scope.Type="Type1";


  $scope.correctData = function(){

    $scope.dataList=$scope.correct;

  }
  $scope.errorData = function(){
    $scope.dataList =$scope.error;

  }

  $http({
  method: 'GET',
  url: $location.absUrl()+'/getcorrect'
  }).then(function successCallback(response) {
    $scope.dataList=response.data;
    $scope.correct=response.data
    $scope.correctlength =$scope.correct.length;
    console.log(response);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

  $http({
  method: 'GET',
  url: $location.absUrl()+'/geterror'
  }).then(function successCallback(response) {
    $scope.error=response.data;
    $scope.errorlength = $scope.error.length;
    console.log(response);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });




});
