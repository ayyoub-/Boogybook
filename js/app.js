angular.module('fsCordova', ['pascalprecht.translate'])
  .service('CordovaService', ['$document', '$q',
    function($document, $q) {

      var d = $q.defer(),
        resolved = false;

      var self = this;
      this.ready = d.promise;

      document.addEventListener('deviceready', function() {
        resolved = true;
        d.resolve(window.cordova);
      });

      setTimeout(function() {
        if (!resolved) {
          if (window.cordova) d.resolve(window.cordova);
        }
      }, 3000);
    }
  ]);


var boogybookApp = angular.module('boogybookApp', ['fsCordova', 'ngSanitize', 'ngRoute', 'ui.router']);

boogybookApp.config(function($routeProvider, $locationProvider, $translateProvider, $stateProvider) {
  // Translation config
  $translateProvider.translations('en', {
    TITLE: 'Hello',
    FOO: 'This is a paragraph.',
    BUTTON_LANG_EN: 'english',
    BUTTON_LANG_DE: 'german'
  });
  $translateProvider.translations('de', {
    TITLE: 'Hallo',
    FOO: 'Dies ist ein Paragraph.',
    BUTTON_LANG_EN: 'englisch',
    BUTTON_LANG_DE: 'deutsch'
  });
  if (typeof(window.localStorage['current_lang']) != 'undefined') $translateProvider.preferredLanguage(JSON.parse(window.localStorage['current_lang']).iso_code);
  else {
    var userLang = 'fr';
    if (!window.cordova) {
      userLang = navigator.language || navigator.userLanguage;
      userLang = userLang.substring(0, 2);
    }
    $translateProvider.preferredLanguage('en');
  }
  $('.menu-toggle, .overlay, .menu-list li a').click(function(e) {
    e.preventDefault();
    $('.overlay').fadeToggle();
    $('.menu-toggle').toggleClass('active');
    $('.side-menu').toggleClass('active');
  });
  // Routes
  var homeState = {
    name: 'home',
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'indexCtrl'
  }
  var productState = {
    name: 'product',
    url: '/product?id',
    templateUrl: 'views/product.html',
    controller: 'ProductCtrl'
  }
  var cartRecapState = {
    name: 'cart_recap',
    url: '/cart_recap',
    templateUrl: 'views/cart/cart_recap.html',
    controller: 'CartCtrl'
  }
  var cartLoginState = {
    name: 'cart_login',
    url: '/cart_login',
    templateUrl: 'views/cart/cart_login.html',
    controller: 'CartCtrl'
  }
  var cartAccountState = {
    name: 'cart_add_account',
    url: '/cart_add_account',
    templateUrl: 'views/cart/cart_add_account.html',
    controller: 'CartCtrl'
  }
  var cartSelectAddressState = {
    name: 'cart_select_address',
    url: '/cart_select_address',
    templateUrl: 'views/cart/cart_select_address.html',
    controller: 'CartCtrl'
  }
  var cartAddressState = {
    name: 'cart_add_address',
    url: '/cart_add_address',
    templateUrl: 'views/cart/cart_add_address.html',
    controller: 'CartCtrl'
  }
  var cartShippingState = {
    name: 'cart_shipping',
    url: '/cart_shipping',
    templateUrl: 'views/cart/cart_shipping.html',
    controller: 'CartCtrl'
  }
  var cartOgoneState = {
    name: 'cart_ogone',
    url: '/cart_ogone',
    templateUrl: 'views/cart/cart_ogone.html',
    controller: 'CartCtrl'
  }
  var contactState = {
    name: 'contact',
    url: '/contact',
    templateUrl: 'views/contact.html',
    controller: 'ContactCtrl'
  }
  var accountState = {
    name: 'myAccount',
    url: '/myAccount',
    templateUrl: 'views/myAccount.html',
    controller: 'MyAccountCtrl'
  }
  var faqState = {
    name: 'faq',
    url: '/faq',
    templateUrl: 'views/faq.html',
    controller: 'FaqCtrl'
  }
  var UploadPicsState = {
    name: 'upload',
    url: '/upload',
    templateUrl: 'views/creation_tool/upload.html',
    controller: 'ToolCtrl'
  }
  var mySelectionState = {
    name: 'mySelection',
    url: '/mySelection',
    templateUrl: 'views/creation_tool/my_selection.html',
    controller: 'ToolCtrl'
  }
  var cropState = {
    name: 'edit',
    url: '/edit?index',
    templateUrl: 'views/creation_tool/crop.html',
    controller: 'ToolCtrl'
  }
  var errorState = {
    name: 'error',
    url: '/error',
    templateUrl: 'views/404.html',
    controller: 'indexCtrl'
  }
  $stateProvider.state(UploadPicsState);
  $stateProvider.state(errorState);
  $stateProvider.state(mySelectionState);
  $stateProvider.state(cropState);
  $stateProvider.state(homeState);
  $stateProvider.state(productState);
  $stateProvider.state(cartRecapState);
  $stateProvider.state(cartLoginState);
  $stateProvider.state(cartAddressState);
  $stateProvider.state(cartSelectAddressState);
  $stateProvider.state(cartAccountState);
  $stateProvider.state(cartShippingState);
  $stateProvider.state(cartOgoneState);
  $stateProvider.state(contactState);
  $stateProvider.state(accountState);
  $stateProvider.state(faqState);
});

boogybookApp.controller('indexCtrl', function(PSAPI, $scope, $window, $rootScope, CordovaService, $location, $rootScope, $translate, $http, $q, $state) {
  // Products list
  $scope.products = new Array();
  $rootScope.products = new Array();
  $scope.userInfos = null;
  $scope.cart = null;
  $scope.globalCategory = 24;
  // Functions
  // Set session storage
  $scope.setStorage = function() {
    sessionStorage.setItem("products", JSON.stringify($scope.products));
    sessionStorage.setItem("cart", JSON.stringify($scope.cart));
  }
  $scope.cleanStorage = function() {
    var i = sessionStorage.length;
    while (i--) {
      var key = sessionStorage.key(i);
      sessionStorage.removeItem(key);
    }
  }
  $scope.getStorage = function() {
    if (typeof sessionStorage.getItem("userInfos") != 'undefined' && sessionStorage.getItem("userInfos") != null)
      $scope.userInfos = JSON.parse(sessionStorage.getItem("userInfos"));
    if (typeof sessionStorage.getItem("cart") != 'undefined' && sessionStorage.getItem("cart") != null)
      $scope.cart = JSON.parse(sessionStorage.getItem("cart"));
  }
  // Get products by category
  $scope.getStorage();
  PSAPI.PSExecute('listBBCaseProductsByCategory', {
    'id_category': $scope.globalCategory,
  }).then(function(r) {
    if (r.OK) {
      $scope.products = r.covers;
      $scope.setStorage();
    }
  });
  // Clear local storage
  $scope.cleanStorage = function(){
    var i = sessionStorage.length;
    while (i--) {
        var key = sessionStorage.key(i);
        sessionStorage.removeItem(key);
    }
    $scope.tool.myLibrary = new Array();
    $scope.tool.size = 0;
  }
  // Check Internet connexion
  $rootScope.online = navigator.onLine;
  if (!$rootScope.online)
    $state.go('error', {}, {
      location: 'replace'
    });
  $window.addEventListener("offline", function() {
    $rootScope.$apply(function() {
      $rootScope.online = false;
      $state.go('error', {}, {
        location: 'replace'
      });
    });
  }, false);

  $window.addEventListener("online", function() {
    $rootScope.$apply(function() {
      $rootScope.online = true;
      $state.go('home', {}, {
        location: 'replace'
      });
    });
  }, false);
  // Get Cart
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
    }
  });
});
