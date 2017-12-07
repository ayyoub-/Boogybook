boogybookApp.controller( "CartCtrl", function(PSAPI, $scope, $state) {
    console.log("Ctrl1 loaded.");
    $scope.cart = null;
    $scope.userInfos = {
      email: 'test@souf.biz',
      password: 'mamaka',
      ordersHistory: null
    };
    // functions
    $scope.getStorage = function() {
      if (typeof sessionStorage.getItem("userInfos") != 'undefined' && sessionStorage.getItem("userInfos") != null)
        $scope.userInfos = JSON.parse(sessionStorage.getItem("userInfos"));
      if (typeof sessionStorage.getItem("cart") != 'undefined' && sessionStorage.getItem("cart") != null)
        $scope.cart = JSON.parse(sessionStorage.getItem("cart"));
    }
    $scope.getCustomerOrder = function(userInfos) {
      PSAPI.PSExecute('getOrders', {
        'authInfos': userInfos
      }).then(function(r) {
        $scope.userInfos.ordersHistory = r.orders;
      });
    }
    $scope.login = function() {
      PSAPI.get('auth', {
        'email': $scope.userInfos.email,
        'passwd': $scope.userInfos.password,
        'active': 1
      }, 'full', 0).then(function(res) {
        $scope.userInfos = res;
        $scope.setStorage();
        $scope.getCustomerOrder($scope.userInfos);
        $state.go('cart_add_address', {}, {location: 'replace'});
      }, function(err) {
        console.log(err);
      });
    }
    $scope.getStorage();
    console.log($scope.cart.products.length);
    console.log($scope.userInfos);
});
