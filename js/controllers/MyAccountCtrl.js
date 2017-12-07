boogybookApp.controller("MyAccountCtrl", function(PSAPI, $scope) {
  console.log("Ctrl1 loaded.");
  // vars
  $scope.userInfos = {
    email: 'test@souf.biz',
    password: 'mamaka',
    ordersHistory: null
  };
  // functions
  $scope.getCustomerOrder = function(userInfos) {
    PSAPI.PSExecute('getOrders', {
      'authInfos': userInfos
    }).then(function(r) {
      console.log(r);
      $scope.userInfos.ordersHistory = r.orders;
    });
  }
  $scope.setStorage = function() {
    sessionStorage.setItem("userInfos", JSON.stringify($scope.userInfos));
  }
  $scope.login = function(email, password) {
    PSAPI.get('auth', {
      'email': email,
      'passwd': password,
      'active': 1
    }, 'full', 0).then(function(res) {
      console.log(res);
      $scope.userInfos = res;
      $scope.setStorage();
      $scope.getCustomerOrder($scope.userInfos);
    }, function(err) {
      console.log(err);
    });
  }
  // check if customer is connected
  if (typeof $scope.userInfos.id == 'undefined')
    $scope.login($scope.userInfos.email, $scope.userInfos.password);
});
