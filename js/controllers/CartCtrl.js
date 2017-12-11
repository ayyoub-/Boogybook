boogybookApp.controller("CartCtrl", function(PSAPI, $scope, $state) {
  // Vars
  $scope.cart = null;
  $scope.userInfos = {
    email: 'test@souf.biz',
    password: 'mamaka',
    ordersHistory: null
  };
  $scope.newAccount = {
    gender: '',
    first_name: '',
    last_name: '',
    password: '',
    email: '',
    date: ''
  };
  $scope.pattern = {
    email: /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
  }
  // functions
  // get local storage
  $scope.getStorage = function() {
    if (typeof sessionStorage.getItem("userInfos") != 'undefined' && sessionStorage.getItem("userInfos") != null)
      $scope.userInfos = JSON.parse(sessionStorage.getItem("userInfos"));
    if (typeof sessionStorage.getItem("cart") != 'undefined' && sessionStorage.getItem("cart") != null)
      $scope.cart = JSON.parse(sessionStorage.getItem("cart"));
  }
  // Save and update local storage
  $scope.setStorage = function() {
    sessionStorage.setItem("userInfos", JSON.stringify($scope.userInfos));
  }
  // Get customer orders
  $scope.getCustomerOrder = function(userInfos) {
    PSAPI.PSExecute('getOrders', {
      'authInfos': userInfos
    }).then(function(r) {
      $scope.userInfos.ordersHistory = r.orders;
    });
  }
  // login
  $scope.login = function() {
    PSAPI.get('auth', {
      'email': $scope.userInfos.email,
      'passwd': $scope.userInfos.password,
      'active': 1
    }, 'full', 0).then(function(res) {
      $scope.userInfos = res;
      $scope.setStorage();
      $scope.getCustomerOrder($scope.userInfos);
      $state.go('cart_add_address', {}, {
        location: 'replace'
      });
    }, function(err) {
      console.log(err);
    });
  }
  // Add new Account
  $scope.addAccount = function() {
    PSAPI.PSExecute('addNewCustomer', {
      'gender': $scope.newAccount.gender,
      'first_name': $scope.newAccount.first_name,
      'last_name': $scope.newAccount.last_name,
      'email': $scope.newAccount.email,
      'password': $scope.newAccount.password,
      'date': $scope.newAccount.date,
    }).then(function(r) {
      console.log(r);
      if (r.OK)
        $state.go('cart_add_address', {}, {
          location: 'replace'
        });
    });
  }
  // Add new address
  $scope.addAddress = function() {
    PSAPI.add('addresses', address, 1).then(function(res1) {}, function(err) {});
  }
  // Get customer addresses
  $scope.getAddresses = function() {
    PSAPI.get('addresses', {
      'id_customer': $scope.userInfos.id,
      'deleted': '0'
    }, 'full').then(function(res) {
      $scope.userInfos.addresses = res;
      $scope.setStorage();
    }, function(res) {
      $scope.userInfos.addresses = [];
    });
  }
  // Check add account form and send request
  $scope.addAccountSubmitForm = function(isValid) {
    // check to make sure the form is completely valid
    console.log(isValid);
    if (isValid) {
      $scope.addAccount();
    }
  };
  // MAin scripting
  $scope.getStorage();
  console.log($scope.cart);
  console.log($scope.userInfos);
  if (typeof $scope.userInfos.addresses == 'undefined')
    $scope.getAddresses();
  console.log($scope.userInfos.addresses);
});
