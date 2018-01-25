'use strict';

angular.module('insight.system').controller('HeaderController',
  function($scope, $rootScope, $location, $modal, getSocket, Global, Block) {
    $scope.global = Global;

    $rootScope.currency = {
      factor: 1,
      bitstamp: 0,
      symbol: 'Nano'
    };

    $scope.menu = [{
      'title': 'Blocks',
      'link': 'blocks'
    }, {
      'title': 'Status',
      'link': 'status'
    }];

    $scope.openScannerModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'scannerModal.html',
        controller: 'ScannerController'
      });
    };

    var _getBlock = function(hash) {
      Block.get({
        blockHash: hash
      }, function(res) {
        $scope.totalBlocks = res.height;
      });
    };

    var socket = getSocket($scope);
    socket.on('connect', function() {
      socket.emit('subscribe', 'inv');

      socket.on('block', function(block) {
        var blockHash = block.toString();
        _getBlock(blockHash);
      });
    });

    $rootScope.isCollapsed = true;

      //Datepicker
      var _formatTimestamp = function (date) {
          var yyyy = date.getUTCFullYear().toString();
          var mm = (date.getUTCMonth() + 1).toString(); // getMonth() is zero-based
          var dd  = date.getUTCDate().toString();

          return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); //padding
      };

      $scope.$watch('dt', function(newValue, oldValue) {
          if (newValue !== oldValue) {
              $location.path('/blocks-date/' + _formatTimestamp(newValue));
          }
      });

      $scope.openCalendar = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = true;
      };

  });

