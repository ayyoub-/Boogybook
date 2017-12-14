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
  $scope.newAddress = null;
  $scope.pattern = {
    email: /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
  }
  $scope.countries = null;
  // functions
  // get local storage
  $scope.getStorage = function() {
    if (typeof sessionStorage.getItem("userInfos") != 'undefined' && sessionStorage.getItem("userInfos") != null)
      $scope.userInfos = JSON.parse(sessionStorage.getItem("userInfos"));
    if (typeof sessionStorage.getItem("countries") != 'undefined' && sessionStorage.getItem("countries") != null)
      $scope.countries = JSON.parse(sessionStorage.getItem("countries"));
    if (typeof sessionStorage.getItem("cart") != 'undefined' && sessionStorage.getItem("cart") != null)
      $scope.cart = JSON.parse(sessionStorage.getItem("cart"));
    console.log($scope.countries);
  }
  // Save and update local storage
  $scope.setStorage = function() {
    sessionStorage.setItem("userInfos", JSON.stringify($scope.userInfos));
    sessionStorage.setItem("countries", JSON.stringify($scope.countries));
  }
  // Get customer orders
  $scope.getCustomerOrder = function(userInfos) {
    PSAPI.PSExecute('getOrders', {
      'authInfos': userInfos
    }).then(function(r) {
      $scope.userInfos.ordersHistory = r.orders;
    });
  }
  // Get countries
  $scope.getCountries = function() {
    PSAPI.get('countries', {
      'active': 1
    }, 'full').then(function(res) {
      var r = [];
      for (p = 0; p < res.length; p++) {
        r.push(res[p]);
      }
      $scope.countries = r;
      console.log($scope.countries);
      $scope.setStorage();
    }, function(res) {
      console.log('errors countries');
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
    PSAPI.PSExecute('addNewAddress', {
      'id_customer': $scope.userInfos.id,
      'lastname': $scope.newAddress.lastname,
      'firstname': $scope.newAddress.firstname,
      'address1': $scope.newAddress.address1,
      'address2': $scope.newAddress.address2,
      'postcode': $scope.newAddress.postcode,
      'id_country': $scope.newAddress.id_country,
      'city': $scope.newAddress.city,
      'phone': $scope.newAddress.phone,
      'alias': $scope.newAddress.alias
    }).then(function(r) {
      console.log(r);
      if (r.OK) {
        alert("OK");
      }
    });
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
  // Check add address form and send
  $scope.addAddressSubmitForm = function(isValid) {
    // check to make sure the form is completely valid
    console.log(isValid);
    if (isValid) {
      console.log($scope.newAddress);
      $scope.addAddress();
    }
  };
  // MAin scripting
  $scope.getStorage();
  console.log($scope.cart);
  console.log($scope.userInfos);
  if (typeof $scope.userInfos.addresses == 'undefined')
    $scope.getAddresses();
  console.log($scope.userInfos.addresses);
  // test add address
  $scope.newAddress = {
    lastname: 'Ayyoub',
    firstname: 'Ayyoub',
    address1: 'Casa',
    address2: 'Casa',
    postcode: '12345',
    company : 'ShareConseil',
    id_country: [],
    city: 'Casa',
    phone: '0988776655',
    phone_mobile:'0988776655',
    alias: 'ayyoub'
  }
  if ($scope.countries == null)
    $scope.getCountries();
  //$scope.addAddress();
  //$scope.getAddresses();
  //console.log($scope.userInfos.addresses);
});
