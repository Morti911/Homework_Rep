(function(){
 var app = angular.module('weatherApp',[]);
  
	app.controller('weatherController', function($scope, $http){

    $scope.location = '';
    
    $scope.initial = function(){
      navigator.geolocation.getCurrentPosition(function(position){


          var apiKey = 'badf29ec82f697c42532258b67d5db65';    // Вставить свой APikey


          var lat = position.coords.latitude;
        var lon = position.coords.longitude;
          $http.jsonp("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=" + apiKey + "&callback=JSON_CALLBACK&units=metric&lang=ru").
              success(function(data){
          $scope.weatherData = data;
          console.log(data);
          $('.loading').hide();
        }).
        error(function(){
          $('.loading').hide();
          $('.error').show().html("Sorry there has been an error connecting to the API");
        });

          $http.jsonp("http://api.openweathermap.org/data/2.5/forecast/daily?lat="+lat+"&lon="+lon+"&APPID=" + apiKey + "&callback=JSON_CALLBACK&cnt=3&units=metric&lang=ru").
          success(function(data){
              $scope.weatherForecastData = data;
              console.log(data);
              $('.loading').hide();
          }).
          error(function(){
              $('.loading').hide();
              $('.error').show().html("Sorry there has been an error connecting to the API");
          });

      }); 
    };
    $scope.initial();
	});
})();