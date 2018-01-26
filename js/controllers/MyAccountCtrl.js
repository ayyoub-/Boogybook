boogybookApp.controller("MyAccountCtrl", function (PSAPI, $scope, $state, $rootScope) {
  console.log("Ctrl1 loaded.");
  // vars
  $scope.userInfos = {
    email: '',
    password: '',
    ordersHistory: null
  };
  $scope.orders = null;
  // functions
  $scope.getCustomerOrder = function (userInfos) {
    PSAPI.PSExecute('getOrders', {
      'authInfos': userInfos
    }).then(function (r) {
      console.log(r);
      $scope.userInfos.ordersHistory = r.orders;
      $scope.orders = r.orders;
      console.log(r.orders.length);
    });
  }
  $scope.setStorage = function () {
    sessionStorage.setItem("userInfos", JSON.stringify($scope.userInfos));
    localStorage.setItem("userInfos", JSON.stringify($scope.userInfos));
  }
  $scope.login = function (email, password) {
    PSAPI.get('auth', {
      'email': email,
      'passwd': password,
      'active': 1
    }, 'full', 0).then(function (res) {
      console.log(res);
      $scope.userInfos = res;
      $scope.setStorage();
      $scope.getCustomerOrder($scope.userInfos);
    }, function (err) {
      console.log(err);
    });
  }
  // check if customer is connected
  if (typeof $rootScope.userInfos == 'undefined')
    $state.go('cart_login', {'type': 0}, {
      location: 'replace'
    });
  else
  $scope.getCustomerOrder($rootScope.userInfos);
});
