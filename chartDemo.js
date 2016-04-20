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


  $scope.queryDatabase = function() {
    var query = '/data?field=absoluteUsedCapacity&table=b1_&start_time=0';
    return $http.get(query);
  };


  $scope.buttonText = 'Start ';
  $scope.interactive = false;
  var vm = this;

   var options = {
    ticks: (display) => false
};


  

  var defaultData = [
      [1]
  	],
    lineChart; //created in onCreate
  
  angular.extend(vm, {
  	capacitySeries: ['Absolute Used Capacity'], 
  	capacityData: defaultData,
    capacityLabels: Object.keys(defaultData[0]),
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
         $scope.queryDatabase().then(function(response) {
            vm.capacityData[0] = response.data.values;
            var len = response.data.values.length;
            var newLabs = [];
            for (var i = 0; i < len; i++) {
              newLabs.push('');
            }

            vm.capacityLabels = newLabs
            continueTimer();
         });

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
  		$scope.buttonText = 'Stop ';
  	} else {
  		$scope.buttonText = 'Start ';
  	}

  };
  
  $scope.$on('create', function (event, chart) {
    lineChart = chart;
	});
}

MainController.$inject = ['$scope', '$timeout', '$http'];