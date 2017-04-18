var app= angular.module("display",[]);

app.controller("get_Student",function($scope,$http,$location){

  $http({
  method: 'GET',
  url: 'http://localhost:3355/get_centre'
  }).then(function successCallback(response) {
    $scope.dataList=response.data;
    console.log(response);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });


});
