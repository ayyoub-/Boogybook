boogybookApp.controller("ProductCtrl", function(PSAPI, $scope, $rootScope, $stateParams, $sce) {
  // vars
  $scope.product = null;
  // Show product details
  $scope.showDetails = function() {
    $('.details-produit').toggleClass('blur');
    $('.details-popup').fadeToggle();
  }
  // Quit details
  $scope.goBack = function() {
    $('.details-produit').toggleClass('blur');
    $('.details-popup').fadeToggle();
  }
  // Get product by ID
  $scope.getProductById = function(id) {
    console.log(id)
    for (var i = 0; i < $rootScope.products.length; i++) {
      if ($rootScope.products[i].id_product == id)
        return $rootScope.products[i];
    }
  }
  // Check if products are loaded
  if (typeof $rootScope.products == 'undefined' || $rootScope.products.length == 0)
    PSAPI.PSExecute('listBBCaseProductsByCategory', {
      'id_category': 24,
    }).then(function(r) {
      if (r.OK) {
        $rootScope.products = r.covers;
        $scope.product = $scope.getProductById($stateParams.id);
      }
    });
  else{
    $scope.product = $scope.getProductById($stateParams.id);
  }
});
