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
  var carttState = {
    name: 'cart',
    url: '/cart',
    templateUrl: 'views/cart.html',
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
  $stateProvider.state(homeState);
  $stateProvider.state(productState);
  $stateProvider.state(carttState);
  $stateProvider.state(contactState);
  $stateProvider.state(accountState);
  $stateProvider.state(faqState);

  $('.menu-toggle, .overlay, .menu-list li a').click(function(e) {
    e.preventDefault();
    $('.overlay').fadeToggle();
    $('.menu-toggle').toggleClass('active');
    $('.side-menu').toggleClass('active');
  });

});

boogybookApp.controller('indexCtrl', function(PSAPI, $scope, $rootScope, CordovaService, $location, $rootScope, $translate, $http, $q) {
  // Products list
  $scope.products = new Array();
  $rootScope.products = new Array();
  PSAPI.PSExecute('listBBCaseProductsByCategory', {
    'id_category': 24,
  }).then(function(r) {
    if (r.OK) {
      $scope.products = r.covers;
      $rootScope.products = r.covers;
    }
  });
});
