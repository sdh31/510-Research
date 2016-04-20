angular.module('chartDemo', ['chart.js'])
	.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      animation: false,
      // colours: ['#803690', '#FF8A80'],
      //responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      //datasetFill: false
      //legendTemplate: /*'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><button ng-click="mainCtrl.toggle()">test</button><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'*/
    });
  }])
	.controller('MainController', MainController);

function MainController($scope, $timeout, $http) {

  $scope.selectedQueue = 'c';
  $scope.queues = ['c', 'a1', 'a2', 'b1', 'b2', 'b3'];


  $scope.queryDatabase = function(field) {
    var query = '/data?field=' + field + '&table=' + $scope.selectedQueue + '_' + '&start_time=0';
    return $http.get(query);
  };

  $scope.buttonText = 'Collect Data';
  $scope.interactive = false;
  var vm = this;

   var absoluteUsedCapacityOptions = {
    arc: (backgroundColor) => '#803690'
    };

    var numPendingApplicationsOptions = {
    arc: (backgroundColor) => '#FF8A80'
  };
      var resourcesUsedOptions = {
    arc: (backgroundColor) => '#FF8A80'
  };



  var absoluteUsedCapacity = [[1], [1]],
      numPendingApplications = [[1]],
      resourcesUsed = [[1]],
      lineChart; //created in onCreate
  
  angular.extend(vm, {
  	absoluteUsedCapacitySeries: ['Absolute Used Capacity (%)', 'Used Capacity (%)'],
    numPendingApplicationsSeries: ['Number of Pending Applications'],
    resourcesUsedSeries: ['Memory Used (MB)'],
  	absoluteUsedCapacity: absoluteUsedCapacity,
    absoluteUsedCapacityLabel: Object.keys(absoluteUsedCapacity[0]),
    numPendingApplications: numPendingApplications,
    numPendingApplicationsLabel: Object.keys(numPendingApplications[0]),
    resourcesUsed: resourcesUsed,
    resourcesUsedLabel: Object.keys(resourcesUsed[0]),
    absoluteUsedCapacityOptions: absoluteUsedCapacityOptions,
    numPendingApplicationsOptions: numPendingApplicationsOptions,
    resourcesUsedOptions: resourcesUsedOptions,
  	onClick: function (points, evt) {
    	
  	},
    enable: true,
    onChange: function() {
      if ( vm.enable )
      	startTimer();
    },
    clear: function() {
      
      vm.data = [[]];
      lineChart.destroy();
    },
    startTimer: startTimer,
    toggle: function() {
      consoel.log('Test')
    }
  });
	
  $scope.toggle = function() {
    // not working yet
    
  };
  
  $scope.$on('toggle', function(e, data) {
    
  });


  $scope.updateStaticValues = function() {
    $scope.queryDatabase('capacity').then(function(response) {
      $scope.capacity = response.data.values[0];
    });
    $scope.queryDatabase('maxCapacity').then(function(response) {
      $scope.maxCapacity = response.data.values[0];
    });
    $scope.queryDatabase('maxApplications').then(function(response) {
      $scope.maxApplications = response.data.values[0];
    });
    $scope.queryDatabase('userLimitFactor').then(function(response) {
      $scope.userLimitFactor = response.data.values[0];
    });
    $scope.queryDatabase('parentQueueName').then(function(response) {
      $scope.parentQueueName = response.data.values[0];
    });
    $scope.queryDatabase('absoluteMaxCapacity').then(function(response) {
      $scope.absoluteMaxCapacity = response.data.values[0];
    });

  };

  $scope.updateStaticValues();

  
  function startTimer() {
    if (	vm.enable	) {
    	$timeout(function() {
         $scope.queryDatabase('absoluteUsedCapacity').then(function(response) {
            vm.absoluteUsedCapacity[0] = response.data.values;
            var len = response.data.values.length;
            var newLabs = [];
            for (var i = 0; i < len; i++) {
              newLabs.push('');
            }

            vm.absoluteUsedCapacityLabel = newLabs;
         });

        $scope.queryDatabase('usedCapacity').then(function(response) {
            vm.absoluteUsedCapacity[1] = response.data.values;
            var len = response.data.values.length;
            var newLabs = [];
            for (var i = 0; i < len; i++) {
              newLabs.push('');
            }

            vm.absoluteUsedCapacityLabel = newLabs;
         });

        $scope.queryDatabase('numPendingApplications').then(function(response) {
            vm.numPendingApplications[0] = response.data.values;
            var len = response.data.values.length;
            var newLabs = [];
            for (var i = 0; i < len; i++) {
              newLabs.push('');
            }

            vm.numPendingApplicationsLabel = newLabs;
          });

        $scope.queryDatabase('resourcesUsed').then(function(response) {
            console.log(response);
            var actualData = [];
            var newLabs = [];
            var len = response.data.values.length;
            for (var i = 0; i < len; i++) {
              var ans = JSON.parse(response.data.values[i])
              actualData.push(ans["memory"])
              newLabs.push('');
            }
            vm.resourcesUsed[0] = actualData
            vm.resourcesUsedLabel = newLabs;
          });


          continueTimer();

      	}, 1000);
    }
  }
  

  function continueTimer() {
  	  if ($scope.interactive) startTimer();
  };

  $scope.toggleInteractive = function() {
  	$scope.interactive = !$scope.interactive;
  	if ($scope.interactive) {
  		startTimer();
  		$scope.buttonText = 'Stop Collecting Data';
  	} else {
  		$scope.buttonText = 'Collect Data';
  	}

  };
  
  $scope.$on('create', function (event, chart) {
    lineChart = chart;
	});
}

MainController.$inject = ['$scope', '$timeout', '$http'];