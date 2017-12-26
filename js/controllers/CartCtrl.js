boogybookApp.controller("CartCtrl", function(PSAPI, $scope, $state, $stateParams) {
  // Vars
  $scope.cart = null;
  $scope.userInfos = {
    email: 'test@souf.biz',
    password: 'mamaka',
    ordersHistory: null
  };
  $scope.connected = false;
  $scope.newAccount = {
    gender: '',
    first_name: '',
    last_name: '',
    password: '',
    email: '',
    date: ''
  };
  $scope.addressUpdate = null;
  $scope.usedCartRule = null;
  $scope.newAddress = null;
  $scope.productsLinks = new Array();
  $scope.voucher = "";
  $scope.voucherError = false;
  $scope.pattern = {
    email: /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
  }
  $scope.countries = null;
  $scope.selectedAddress = 0;
  $scope.cartLoaded = false;
  // functions
  // get local storage
  $scope.getStorage = function() {
    if (typeof sessionStorage.getItem("userInfos") != 'undefined' && sessionStorage.getItem("userInfos") != null) {
      $scope.userInfos = JSON.parse(sessionStorage.getItem("userInfos"));
    }
    if (typeof $scope.userInfos.addresses == 'undefined' || $scope.userInfos.addresses.length == 0)
      $scope.getAddresses();
    if (typeof sessionStorage.getItem("countries") != 'undefined' && sessionStorage.getItem("countries") != null)
      $scope.countries = JSON.parse(sessionStorage.getItem("countries"));
    if (typeof sessionStorage.getItem("cart") != 'undefined' && sessionStorage.getItem("cart") != null)
      $scope.cart = JSON.parse(sessionStorage.getItem("cart"));
    if (typeof sessionStorage.getItem("cartRules") != 'undefined' && sessionStorage.getItem("cartRules") != null)
      $scope.usedCartRule = JSON.parse(sessionStorage.getItem("cartRules"));
  }
  // Save and update local storage
  $scope.setStorage = function() {
    sessionStorage.setItem("userInfos", JSON.stringify($scope.userInfos));
    sessionStorage.setItem("countries", JSON.stringify($scope.countries));
    sessionStorage.setItem("cart", JSON.stringify($scope.cart));
    sessionStorage.setItem("cartRules", JSON.stringify($scope.usedCartRule));
  }
  // Update product quantity
  $scope.addQuantity = function(index, quantity) {
    $(".upload-progress").addClass("active");
    PSAPI.PSExecute('updateProductCartQuantity', {
      'product': $scope.cart.products[index].id_product,
      'cart': $scope.cart.id,
      'qty': quantity,
      'currentqty': $scope.cart.products[index].quantity,
    }).then(function(r) {
      if (r.OK)
        $scope.getCartDetails();
    });
  }
  // Get customer orders
  $scope.getCustomerOrder = function(userInfos) {
    PSAPI.PSExecute('getOrders', {
      'authInfos': userInfos
    }).then(function(r) {
      $scope.userInfos.ordersHistory = r.orders;
    });
  }
  $scope.removeProductFromCart = function(index) {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        $(".upload-progress").addClass("active");
        PSAPI.PSExecute('removeProductFromCart', {
          'product': $scope.cart.products[index].id_product,
          'cart': $scope.cart.id,
        }).then(function(r) {
          if (r.OK)
            $scope.getCartDetails();
        });
      }
    })

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
      $state.go('cart_select_address', {}, {
        location: 'replace'
      });
    }, function(err) {
      console.log(err);
    });
  }
  // Create Order
  $scope.createNewOrder = function() {
    $scope.selectedAddress = parseInt($("#selectedAddress").val());
    PSAPI.PSExecute('makeOrder', {
      'address': $scope.selectedAddress,
      'cart': $scope.cart.id,
      'total_products': $scope.cart.total_products,
      'total_products_wt': $scope.cart.total_products_wt,
      'total_shipping': $scope.cart.total_shipping,
      'total_shipping_tax_exc': $scope.cart.total_shipping_tax_exc,
      'id_customer': $scope.userInfos.id,
    }).then(function(r) {
      $state.go('successorder', {}, {
        location: 'replace'
      });
    });
  }
  // Add voucher
  $scope.addVoucher = function() {
    $(".upload-progress").addClass("active");
    $scope.voucher = $("#coupon-code").val();
    PSAPI.PSExecute('addVoucherToCart', {
      'voucher': $scope.voucher,
      'cart': $scope.cart.id,
    }).then(function(r) {
      if (r.OK && r.label != null) {
        $scope.getCartDetails();
        $scope.voucherError = false;
        $scope.usedCartRule = r.cartrule;
        $scope.setStorage();
      } else {
        $scope.voucherError = true;
        $(".upload-progress").removeClass("active");
      }
    });
  }
  // Remove Voucher
  $scope.removeVoucher = function() {
    $(".upload-progress").addClass("active");
    $scope.voucher = $("#coupon-code").val();
    PSAPI.PSExecute('removeVoucherToCart', {
      'voucher': 'WYSIWYGD',
      'cart': $scope.cart.id,
    }).then(function(r) {
      if (r.OK && r.label != null) {
        $scope.getCartDetails();
        $scope.voucherError = false;
        $scope.usedCartRule = null;
        $scope.setStorage();
      } else {
        $scope.voucherError = true;
        $(".upload-progress").removeClass("active");
      }
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
      if (r.OK) {
        alert("OK");
      }
    });
  }
  // Update Existing address
  $scope.updateAddress = function() {
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
      if (r.OK) {
        alert("OK");
      }
    });
  }
  // Get customer addresses
  $scope.getAddresses = function() {
    $(".upload-progress").addClass("active");
    if (typeof $scope.userInfos.id != undefined)
      PSAPI.get('addresses', {
        'id_customer': $scope.userInfos.id,
        'deleted': '0'
      }, 'full').then(function(res) {
        $scope.userInfos.addresses = res;
        console.log($scope.userInfos.addresses);
        $scope.setStorage();
        $(".upload-progress").removeClass("active");
      }, function(res) {
        $scope.userInfos.addresses = [];
        $(".upload-progress").removeClass("active");
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
    } else {
      swal(
        'Oops...',
        'Merci de vérifier votre formulaire',
        'error'
      )
    }
  };
  $scope.updateAddressSubmitForm = function(isValid) {
    // check to make sure the form is completely valid
    console.log(isValid);
    if (isValid) {
      console.log($scope.newAddress);
      $scope.updateAddress();
    } else {
      swal(
        'Oops...',
        'Merci de vérifier votre formulaire',
        'error'
      )
    }
  };
  // Get product images
  $scope.getProductImage = function(id_p) {
    PSAPI.PSExecute('getProductImage', {
      'id_product': id_p
    }).then(function(res) {
      if (res.OK)
        $scope.productsLinks.push(res.link);
    });
  }
  // Get Address by ID
  $scope.getAddressById = function(id) {
    console.log($scope.userInfos.addresses);
    console.log(id);
    $scope.userInfos.addresses.forEach(elem => {
      console.log(parseInt(id));
      console.log(elem.id);
      if (elem.id == parseInt(id))
        $scope.addressUpdate = elem;
    });
  }
  // Get cart details
  $scope.getCartDetails = function() {
    params = {};
    // check if user is connected
    if (typeof($scope.userInfos) != 'undefined' && $scope.userInfos != null) {
      params.authInfos = $scope.userInfos;
      params.authInfos.addresses = [];
    }
    // check if he has an old existing card
    if (typeof($scope.cart) != 'undefined' && $scope.cart != null)
      params.id_cart = $scope.cart.id;
    PSAPI.PSExecute('getCartId', params).then(function(res) {
      if (typeof res.id != 'undefined') {
        id_cart = res.id;
        $scope.cart = res;
        $scope.setStorage();
        console.log($scope.cart);
        $scope.cart.products.forEach(elem => {
          $scope.getProductImage(elem.id_product);
        });
        $(".upload-progress").removeClass("active");
      }
    });
  }
  // MAIN PROCESS
  $('#langue-select').dropdown();
  if ($state.$current.self.name == 'cart_recap')
    $(".upload-progress").addClass("active");
  $scope.getStorage();
  console.log($scope.userInfos.addresses);
  $scope.getCartDetails();
  if (typeof $scope.userInfos.id != 'undefined')
    $scope.connected = true;
  if (typeof $scope.userInfos.addresses == 'undefined')
    $scope.getAddresses();
  // test add address
  $scope.newAddress = {
    lastname: 'Ayyoub',
    firstname: 'Ayyoub',
    address1: 'Casa',
    address2: 'Casa',
    postcode: '12345',
    company: 'ShareConseil',
    id_country: [],
    city: 'Casa',
    phone: '0988776655',
    phone_mobile: '0988776655',
    alias: 'ayyoub'
  }
  if ($scope.countries == null)
    $scope.getCountries();
  //$scope.addAddress();
  if (typeof $stateParams.id_address != 'undefined') {
    $(".upload-progress").addClass("active");
    PSAPI.get('addresses', {
      'id_customer': $scope.userInfos.id,
      'deleted': '0'
    }, 'full').then(function(res) {
      $scope.userInfos.addresses = res;
      $scope.getAddressById($stateParams.id_address);
      console.log($scope.addressUpdate);
      $(".upload-progress").removeClass("active");
    }, function(res) {});

  }
  // $scope.removeVoucher();
  //console.log($scope.userInfos.addresses);
});
