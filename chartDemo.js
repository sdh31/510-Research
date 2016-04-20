angular.module('chartDemo', ['chart.js'])
	.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      animation: false,
      colours: ['#803690', '#FF8A80'],
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

   var options = {
    ticks: (display) => false
};


  var absoluteUsedCapacity = [[1]],
      numPendingApplications = [[1]],
      lineChart; //created in onCreate
  
  angular.extend(vm, {
  	absoluteUsedCapacitySeries: ['Absolute Used Capacity'],
    numPendingApplicationsSeries: ['Number of Pending Applications'],
  	absoluteUsedCapacity: absoluteUsedCapacity,
    absoluteUsedCapacityLabel: Object.keys(absoluteUsedCapacity[0]),
    numPendingApplications: numPendingApplications,
    numPendingApplicationsLabel: Object.keys(numPendingApplications[0]),
    options: options,
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

  
  function startTimer() {
    if (	vm.enable	) {
    	$timeout(function() {
         var count = 0;
         $scope.queryDatabase('absoluteUsedCapacity').then(function(response) {
            vm.absoluteUsedCapacity[0] = response.data.values;
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
            count++;
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