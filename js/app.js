angular.module('fsCordova', ['pascalprecht.translate', 'stripe.checkout'])
  .service('CordovaService', ['$document', '$q',
    function ($document, $q) {

      var d = $q.defer(),
        resolved = false;

      var self = this;
      this.ready = d.promise;

      document.addEventListener('deviceready', function () {
        resolved = true;
        d.resolve(window.cordova);
      });

      setTimeout(function () {
        if (!resolved) {
          if (window.cordova) d.resolve(window.cordova);
        }
      }, 3000);
    }
  ]);


var boogybookApp = angular.module('boogybookApp', ['fsCordova', 'ngSanitize', 'ngRoute', 'ui.router', 'stripe.checkout', 'ngCordova']);


boogybookApp.directive('pwCheck', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwCheck;
      elem.add(firstPassword).on('keyup', function () {
        scope.$apply(function () {
          var v = elem.val() === $(firstPassword).val();
          ctrl.$setValidity('pwmatch', v);
        });
      });
    }
  }
}]);

boogybookApp.config(function ($routeProvider, $locationProvider, $translateProvider, $stateProvider, StripeCheckoutProvider) {
  StripeCheckoutProvider.defaults({
    key: "pk_live_WkGcczYR27uMdxAgpPLMOr36"
  });
  // Translation config
  // $translateProvider.useUrlLoader('http://live.boogybook.com/module/boogybook/translations');
  $translateProvider.translations('fr', {
    DETAILS: 'Détails',
    CREER: 'Créer',
    ACCOUNT: 'Mon compte',
    DATE_NAISSANCE: 'Date de naissance',
    CART: 'Panier',
    TITLE: 'Titre',
    CONTACT: 'Contact',
    RETOUR: 'Retour',
    FICHE_TECHNIQUE: 'Fiche Technique',
    DIMENSIONS_DE_CHAQUE_PAGE: 'Dimensions de chaque page',
    LONGEUR: 'Longeur',
    LARGEUR: 'Largeur',
    POIDS: 'Poids',
    COMPOSITION: 'Compositions',
    Postal_cod: 'Code postal',
    JE_CREE: 'Je créer',
    ACCUEIL: 'Accueil',
    MY_ACCOUNT: 'Mon compte',
    Historique_de_vos_commandes: 'Historique de vos commandes',
    Reference: 'Référence',
    Date: 'Date',
    Prix_total: 'Prix total',
    etat: 'Etat',
    en_cours_impression: "En cours d'impression",
    En_cours_de_preparation: 'En cours de préparation',
    Canceled: 'Annulée',
    Paiement_accepte: 'Paiement accepté',
    Envoyez_un_message: 'Envoyez un message',
    Reference_de_commande: 'Référence de le commande',
    Message: 'Message',
    Envoyer: 'Envoyer',
    Connexion_internet_lente_ou_pas_de_connexion_internet: 'Connexion internet lente ou pas de connexion internet',
    Veuillez_verifier_vos_parametres_Internet: 'Veuillez vérifier vos paramétres internet',
    Images_selectionnees: 'Images séléctionnées',
    Continuer: 'Continuer',
    telecharger_depuis_mobile: 'télécharger depuis mobile',
    Mon_Album: 'Mon album',
    Ajouter_des_photos: 'Ajouter des photos',
    en_cours: 'En cours',
    Choisissez_la_police: 'Choisissez la police',
    Recadrage: 'Recadrage',
    filtres: 'filtres',
    Merci_de_patienter: 'Merci de patienter',
    Texte: 'Texte',
    Vider_ma_biblio: 'Vider ma biblio',
    Images_selectionnées: 'Images selectionnées',
    Continue_mes_achats: 'Continue mes achats',
    INSCRIPTION: 'Inscription',
    Nom: 'Nom',
    prenom: 'Prénom',
    password: 'Mot de passe',
    Date_de_naissance: 'Date de naissance',
    sinscrire_a_la_newsletter: "s'inscrire à la newsletter",
    Recevez_les_offres_speciales_de_nos_partenaires: 'Recevez les offres spéciales de nos partenaires',
    sinscrire: "S'inscrire",
    MODIFIER_VOTRE_ADRESSE: 'Modifier votre adresse',
    company: 'Société',
    address: 'Adresse1',
    address2: 'Adresse 2',
    address_2: "Adresse 2",
    city: 'Ville',
    telephone_fixe: 'Téléphone Fixe',
    telephone_mobile: 'Téléphone mobile',
    Donnez_un_titre_a_cette_adresse_pour_la_retrouver_plus_facilement: 'Donnez un titre à cette adresse pour la retrouver plus facilement',
    Enregister: 'Enregister',
    Vos_adresses: 'Vos adresses',
    Choisissez_une_adresse_de_livraison: 'Choisissez une adresse de livraison',
    Utiliser_la_meme_adresse_pour_la_facturation: 'Utiliser la meme adresse pour la facturation',
    Adresse_de_livraison: 'Adresse de livraison',
    Mettre_a_jour: 'Mettre à jour',
    Ajouter_une_nouvelle_adresse: 'Ajouter une nouvelle adresse',
    Commander: 'Commander',
    Recapitulatif: 'Récapitulatif',
    Prix: 'Prix',
    Quantite: 'Quantité',
    Frais_de_port: 'Frais de port',
    Quantite: 'Quantité',
    Bons_de_reduction: 'Bons de réduction',
    Voucher_Error: 'Bon de réduction incorrect',
    TOTAL: 'Total',
    Votre_panier_estvide: 'Votre panier est vide',
    PAIEMENT: 'PAIEMENT',
    Payez_par_carte_bancaire: 'Payez par carte bancaire',
    Connexion: 'Connexion',
    Creez_votre_compte: 'Créez votre compte',
    AJOUTER_UNE_NOUVELLE_ADRESSE: 'AJOUTER UNE NOUVELLE ADRESSE',
    Donnez_un_titre_a_cette_adresse_pour_la_retrouver_plus_facilement: 'Donnez un titre à cette adresse pour la retrouver plus facilement',
    Enregister: ' Enregister',
    Votre_nom_est_invalide: "Votre nom est invalide",
    Votre_prenom_est_invalide: "Votre prénom est invalide",
    Votre_email_est_invalide: "Votre adresse email est invalide",
    Votre_password_est_invalide: "Votre mot de passe est invalide",
    Votre_date_naissance_est_invalide: "Votre date de naissance est invalide",
    Votre_address_est_invalide: "Votre adresse est invalide",
    Votre_postal_est_invalide: "Votre code postale est invalide",
    Votre_city_est_invalide: "Votre ville est invalide",
    Votre_mobile_est_invalide: "Votre numéro de téléphone est invalide",
    Votre_alias_est_invalide: "Votre alias est invalide",
  });
  $translateProvider.translations("en", {
    DETAILS: "DETAILS",
    CREER: "CREATE",
    ACCOUNT: "english",
    TITLE: 'Title',
    CART: "CART",
    Postal_cod: 'Postal code',
    DATE_NAISSANCE: 'Birthday',
    CONTACT: "CONTACT",
    RETOUR: "BACK",
    FICHE_TECHNIQUE: "TECHNICAL SHEET",
    DIMENSIONS_DE_CHAQUE_PAGE: "DIMENSIONS OF EACH PAGE",
    LONGEUR: "LENGTH",
    LARGEUR: "WIDTH",
    POIDS: "WEIGHT",
    COMPOSITION: "COMPOSITION",
    JE_CREE: "I CREATE",
    ACCUEIL: "HOME",
    MY_ACCOUNT: "MY ACCOUNT",
    Historique_de_vos_commandes: "History of your orders",
    Reference: "Reference",
    Date: "Date",
    Prix_total: "Total price",
    etat: "state",
    en_cours_impression: "in progress impression",
    En_cours_de_preparation: "In preparation",
    Canceled: "Canceled",
    Paiement_accepte: "Accepted payment",
    Envoyez_un_message: "Send a message",
    Reference_de_commande: "Order reference",
    Message: "Message",
    Envoyer: "Send",
    Connexion_internet_lente_ou_pas_de_connexion_internet: "Slow internet connection or no internet connection",
    Veuillez_verifier_vos_parametres_Internet: "Please check your Internet settings",
    Images_selectionnees: "Selected Images",
    Continuer: "Continue",
    telecharger_depuis_mobile: "download from mobile",
    Mon_Album: "My Album",
    Ajouter_des_photos: "Add pictures",
    en_cours: "In progress",
    Choisissez_la_police: "Select a font",
    Recadrage: "Cropping",
    filtres: "filters",
    Merci_de_patienter: "Please wait",
    Texte: "Text",
    Vider_ma_biblio: "Clear my album",
    Images_selectionnées: "Selected Images",
    Continue_mes_achats: "Continue shopping",
    INSCRIPTION: "REGISTRATION",
    Nom: "Name",
    prenom: "first name",
    password: "password",
    Date_de_naissance: "Birth date",
    sinscrire_a_la_newsletter: "Subscribe to the newsletter",
    Recevez_les_offres_speciales_de_nos_partenaires: "Receive Special Offers From Our Partners",
    sinscrire: "register",
    MODIFIER_VOTRE_ADRESSE: "CHANGE YOUR ADDRESS",
    company: "company",
    address: "address",
    address_2: "address 2",
    city: "city",
    telephone_fixe: "phone",
    telephone_mobile: "mobile phone",
    Donnez_un_titre_a_cette_adresse_pour_la_retrouver_plus_facilement: "Give a title to this address to find it more easily",
    Enregister: "Register",
    Vos_adresses: "Your Addresses",
    Choisissez_une_adresse_de_livraison: "Choose a shipping address",
    Utiliser_la_meme_adresse_pour_la_facturation: "Use Same Address For Billing",
    Adresse_de_livraison: "Shipping address",
    Mettre_a_jour: "Update",
    Ajouter_une_nouvelle_adresse: "Add a new address",
    Commander: "Order",
    Recapitulatif: "Summary",
    Prix: "Price",
    Quantite: "Amount",
    Prix: "Price",
    Frais_de_port: "Shipping fee",
    Quantité: "Amount",
    Bons_de_reduction: "Coupons",
    Voucher_Error: "Voucher Error",
    TOTAL: "TOTAL",
    Votre_panier_estvide: "Your cart is empty",
    PAIEMENT: "PAYMENT",
    Payez_par_carte_bancaire: "Pay by Credit Card",
    Connexion: "Log in",
    Creez_votre_compte: "Create your account",
    AJOUTER_UNE_NOUVELLE_ADRESSE: "ADD A NEW ADDRESS",
    Donnez_un_titre_a_cette_adresse_pour_la_retrouver_plus_facilement: "Give a title to this Address To find it more easily",
    Votre_nom_est_invalide: "Your name is invalid",
    Votre_prenom_est_invalide: "Your name is invalid",
    Votre_email_est_invalide: "Your email is invalid",
    Votre_password_est_invalide: "Your password is invalid",
    Votre_date_naissance_est_invalide: "Your birthday is invalid",
    Votre_address_est_invalide: "Your address is invalid",
    Votre_postal_est_invalide: "Your postal code is invalid",
    Votre_city_est_invalide: "Your city is invalid",
    Votre_mobile_est_invalide: "Your mobile phone is invalid",
    Votre_alias_est_invalide: "Your alias is invalid",
  });
  $translateProvider.translations("es", {
    DETAILS: "Hello",
    CREER: "crear",
    ACCOUNT: "cuenta",
    Votre_nom_est_invalide: "Tu nombre no es válido",
    Votre_prenom_est_invalide: "Tu nombre no es válido",
    Votre_email_est_invalide: "Tu dirección de correo electrónico no es válida",
    Votre_password_est_invalide: "Su contraseña no es válida",
    Votre_date_naissance_est_invalide: "Tu fecha de nacimiento no es válida",
    Votre_address_est_invalide: "Tu dirección no es válida",
    Votre_postal_est_invalide: "Su código postal no es válido",
    Votre_city_est_invalide: "Tu ciudad no es válida",
    Votre_mobile_est_invalide: "Tu teléfono móvil no es válido",
    Votre_alias_est_invalide: "Your alias is invalid",
    TITLE: 'título',
    CART: "cesta",
    CONTACT: "contacto",
    Postal_cod: 'Código postal',
    RETOUR: "volver",
    FICHE_TECHNIQUE: "ficha técnica",
    DIMENSIONS_DE_CHAQUE_PAGE: "dimensiones de cada pagina",
    LONGEUR: "longtitud",
    LARGEUR: "ancho",
    POIDS: "peso",
    COMPOSITION: "composición",
    JE_CREE: "crear",
    ACCUEIL: "pàgina principal",
    MY_ACCOUNT: "mi cuenta",
    Historique_de_vos_commandes: "historico de ordenes",
    Reference: "referencía",
    Date: "fecha",
    DATE_NAISSANCE: 'fecha de nacimiento',
    Prix_total: "precio total",
    etat: "estado",
    en_cours_impression: "impresión en curso",
    En_cours_de_preparation: "preparación de la impresión",
    Canceled: "cancelada",
    Paiement_accepte: "pago aceptado",
    Envoyez_un_message: "enviar un mensaje",
    Reference_de_commande: "referencia de la orden",
    Message: "mensaje",
    Envoyer: "enviar",
    Connexion_internet_lente_ou_pas_de_connexion_internet: "conexión internet lenta o no internet",
    Veuillez_verifier_vos_parametres_Internet: "verefique por favor tu internet",
    Images_selectionnees: "imagenes seleccionadas",
    Continuer: "continuar",
    telecharger_depuis_mobile: "descargar desde móvil",
    Mon_Album: "mi album",
    Ajouter_des_photos: "añadir fotos",
    en_cours: "en curso",
    Choisissez_la_police: "elegir ",
    Recadrage: "reajustar",
    filtres: "filtros",
    Merci_de_patienter: "espera por favor",
    Texte: "texto",
    Vider_ma_biblio: "vaciar mi biblioteca",
    Images_selectionnées: "imagenes seleccionadas",
    Continue_mes_achats: "continuar comprando",
    INSCRIPTION: "inscripción",
    Nom: "apellido",
    prenom: "nombre",
    password: "contraseña",
    Date_de_naissance: "fecha de nacimiento",
    sinscrire_a_la_newsletter: "suscribire a la newsletter",
    Recevez_les_offres_speciales_de_nos_partenaires: "recibir ofertas especiales de nuestors socios",
    sinscrire: "Inscribirse",
    MODIFIER_VOTRE_ADRESSE: "cambiar direcciòn",
    company: "empresa",
    address: "direcciòn",
    address_2: "direcciòn 2",
    city: "ciudad",
    telephone_fixe: "teléfono fijo",
    telephone_mobile: "móvil",
    Donnez_un_titre_a_cette_adresse_pour_la_retrouver_plus_facilement: "Dar una idicaciòn para encontrarla fàcilmente",
    Enregister: "registrar",
    Vos_adresses: "tu direcciòn",
    Choisissez_une_adresse_de_livraison: "elegir una dirrecciòn",
    Utiliser_la_meme_adresse_pour_la_facturation: "elegir la misma direcciòn para la facturación",
    Adresse_de_livraison: "direcciòn de la entrega",
    Mettre_a_jour: "actualizar",
    Ajouter_une_nouvelle_adresse: "añadir una direcciòn",
    Commander: "ordenar",
    Recapitulatif: "resumen",
    Prix: "precio",
    Quantite: "cantidad",
    Prix: "precio",
    Frais_de_port: "gastos de envío",
    Quantité: "cantidad",
    Bons_de_reduction: "cupones de descuento",
    Voucher_Error: "error",
    TOTAL: "total",
    Votre_panier_estvide: "tu cesta esta vacìa",
    PAIEMENT: "pago",
    Payez_par_carte_bancaire: "pagar con tarjeta de débito",
    Connexion: "conexión",
    Creez_votre_compte: "crear su cuenta",
    AJOUTER_UNE_NOUVELLE_ADRESSE: "añadir una nueva direcciòn",
    Donnez_un_titre_a_cette_adresse_pour_la_retrouver_plus_facilement: "dar una indicación para encontrar la direcciòn fàcilmente",
    Enregister: "registrar",
  });
  if (typeof (window.localStorage['current_lang']) != 'undefined') $translateProvider.preferredLanguage(JSON.parse(window.localStorage['current_lang']).iso_code);
  else {
    var userLang = 'fr';
    if (!window.cordova) {
      userLang = navigator.language || navigator.userLanguage;
      userLang = userLang.substring(0, 2);
    }
    $translateProvider.preferredLanguage('fr');
  }
  $('.menu-toggle, .overlay, .menu-list li a').click(function (e) {
    e.preventDefault();
    $('.overlay').fadeToggle();
    $('.menu-toggle').toggleClass('active');
    $('.side-menu').toggleClass('active');
    $('.btn-hm').toggleClass('active');
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
    controller: 'CartCtrl',
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
  }
  var cartLoginState = {
    name: 'cart_login',
    url: '/cart_login?type',
    templateUrl: 'views/cart/cart_login.html',
    controller: 'CartCtrl',
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
  }
  var cartAccountState = {
    name: 'cart_add_account',
    url: '/cart_add_account',
    templateUrl: 'views/cart/cart_add_account.html',
    controller: 'CartCtrl',
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
  }
  var cartSelectAddressState = {
    name: 'cart_select_address',
    url: '/cart_select_address',
    templateUrl: 'views/cart/cart_select_address.html',
    controller: 'CartCtrl',
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
  }
  var cartAddressState = {
    name: 'cart_add_address',
    url: '/cart_add_address',
    templateUrl: 'views/cart/cart_add_address.html',
    controller: 'CartCtrl',
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
  }
  var addressUpdateState = {
    name: 'address_update',
    url: '/address_update?id_address',
    templateUrl: 'views/cart/cart_update_address.html',
    controller: 'CartCtrl',
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
  }
  var cartShippingState = {
    name: 'cart_shipping',
    url: '/cart_shipping',
    templateUrl: 'views/cart/cart_shipping.html',
    controller: 'CartCtrl',
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
  }
  var cartOgoneState = {
    name: 'cart_ogone',
    url: '/cart_ogone',
    templateUrl: 'views/cart/cart_ogone.html',
    controller: 'CartCtrl',
    resolve: {
      // checkout.js isn't fetched until this is resolved.
      stripe: StripeCheckoutProvider.load
    }
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
    url: '/mySelection?inde&type',
    templateUrl: 'views/creation_tool/my_selection.html',
    controller: 'ToolCtrl'
  }
  var mySelectionNoteState = {
    name: 'my_selection_notebook',
    url: '/my_selection_notebook?inde&type',
    templateUrl: 'views/creation_tool/my_selection_notebook.html',
    controller: 'ToolCtrl'
  }
  var cropState = {
    name: 'edit',
    url: '/edit?index&type',
    templateUrl: 'views/creation_tool/crop.html',
    controller: 'ToolCtrl'
  }

  var errorState = {
    name: 'error',
    url: '/error',
    templateUrl: 'views/404.html',
    controller: 'indexCtrl'
  }
  var tutorialState = {
    name: 'tutorial',
    url: '/tutorial',
    templateUrl: 'views/tutorial.html',
    controller: 'indexCtrl'
  }
  var successOrderState = {
    name: 'successorder',
    url: '/successorder',
    templateUrl: 'views/cart-payment-2.html',
    controller: 'CartCtrl'
  }
  var cropNoteState = {
    name: 'note-crop-tool',
    url: '/note-crop-tool?index&type',
    templateUrl: 'views/creation_tool/note-crop-tool.html',
    controller: 'ToolCtrl'
  }
  var cropNoteFilterState = {
    name: 'note-filter-tool',
    url: '/note-filter-tool?index&type',
    templateUrl: 'views/creation_tool/note-filtre-tool.html',
    controller: 'ToolCtrl'
  }
  var cropNoteTextState = {
    name: 'note-text-tool',
    url: '/note-text-tool?index&type',
    templateUrl: 'views/creation_tool/note-text-tool.html',
    controller: 'ToolCtrl'
  }
  $stateProvider.state(UploadPicsState);
  $stateProvider.state(cropNoteState);
  $stateProvider.state(mySelectionNoteState);
  $stateProvider.state(cropNoteFilterState);
  $stateProvider.state(cropNoteTextState);
  $stateProvider.state(successOrderState);
  $stateProvider.state(tutorialState);
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
  $stateProvider.state(addressUpdateState);
});
boogybookApp.run(function ($log, StripeCheckout) {
  StripeCheckout.defaults({
    opened: function () {
      $log.debug("Stripe Checkout opened");
    },
    closed: function () {
      $log.debug("Stripe Checkout closed");
    }
  });
});
boogybookApp.controller('indexCtrl', function (PSAPI, $scope, $filter, $window, $rootScope, CordovaService, $location, $rootScope, $translate, $http, $q, $state, StripeCheckout) {
  // Products list
  $scope.products = new Array();
  $rootScope.products = new Array();
  $scope.userInfos = null;
  $scope.cart = null;
  $scope.globalCategory = 24;
  $scope.cartSize = 0;
  $scope.selectedLang = 'fr';
  $scope.connected = false;
  // Functions
  // Set session storage
  $scope.setStorage = function () {
    sessionStorage.setItem("products", JSON.stringify($scope.products));
    sessionStorage.setItem("cart", JSON.stringify($scope.cart));
  }
  $scope.goHome = function () {
    $state.go('home', {}, {
      location: 'replace',
      reload: true
    });
  }
  $scope.cleanStorage = function () {
    var i = sessionStorage.length;
    while (i--) {
      var key = sessionStorage.key(i);
      sessionStorage.removeItem(key);
    }
  }
  $scope.getStorage = function () {
    if (typeof sessionStorage.getItem("products") != 'undefined' && sessionStorage.getItem("products") != null)
      $scope.products = JSON.parse(sessionStorage.getItem("products"));
    else
      $scope.getProducts();
    if (typeof sessionStorage.getItem("cart") != 'undefined' && sessionStorage.getItem("cart") != null)
      $scope.cart = JSON.parse(sessionStorage.getItem("cart"));
    else
      $scope.getCartDetails();
  }
  $scope.tutoPrevious = function () {
    $state.go('home', {}, {
      location: 'replace'
    });
  }
  $scope.tutoNext = function () {
    var currentSlide = $('.tutorial-intro').find('.slide.active');
    var currentIndicator = $('.slider-indicators').find('li.active');

    if ($('.slide.active').hasClass('slide-5')) {
      $state.go('home', {}, {
        location: 'replace'
      });
    } else {
      //Reset
      $('.tutorial-intro').find('.slide').removeClass('active');
      $('.slider-indicators').find('li').removeClass('active');
      //Activate
      currentSlide.next().addClass('active');
      currentIndicator.next().addClass('active');
    }
  }
  // Get cart details
  $scope.getCartDetails = function () {
    params = {};
    // check if user is connected
    if (typeof ($rootScope.userInfos) != 'undefined' && $rootScope.userInfos != null) {
      params.authInfos = $rootScope.userInfos;
      params.authInfos.addresses = [];
    }
    // check if he has an old existing card
    if (typeof ($scope.cart) != 'undefined' && $scope.cart != null)
      params.id_cart = $scope.cart.id;
    PSAPI.PSExecute('getCartId', params).then(function (res) {
      if (typeof res.id != 'undefined') {
        id_cart = res.id;
        $scope.cart = res;
        console.log($scope.cart);
        $scope.setStorage();
      }
    });
  }
  // Get products by category
  $scope.getProducts = function () {
    PSAPI.PSExecute('listBBCaseProductsByCategory', {
      'id_category': $scope.globalCategory,
    }).then(function (r) {
      if (r.OK) {
        $scope.products = r.covers;
        var itemsSorted = $filter('orderBy')($scope.products, 'id_product');
        var help = itemsSorted[0];
        itemsSorted[0] = itemsSorted[itemsSorted.length - 1];
        itemsSorted[itemsSorted.length - 1] = help;
        $scope.products = itemsSorted
        $scope.setStorage();
      }
    });
  }
  // Change langue
  $scope.updateLangue = function () {
    console.log("OK");
    console.log($scope.selectedLang);
    $translate.use($scope.selectedLang).then(function (data) {
      // console.log('ChangeLang#Success', data);
    }, function (error) {
      // console.log('ChangeLang#Error', error);
    });
  }
  // Get cart size
  $scope.getCartSize = function (cart) {
    PSAPI.PSExecute('getCartSize', {
      'cart': cart,
    }).then(function (r) {
      if (r.OK) {
        $scope.cartSize = r.size;
        $('.counter').html($scope.cartSize);
      }
    });
  }
  $scope.getStorage();
  if ($rootScope.userInfos != null){
    $scope.connected = true;
  }
  // alert($scope.connected);
  console.log($rootScope);
  console.log($scope.connected);
  if (typeof $scope.cart != 'undefined' && $scope.cart != null) {
    $scope.getCartSize($scope.cart.id);
  }
  else {
    $scope.cartSize = 0;
  }
  // Check Internet connexion
  $rootScope.online = navigator.onLine;
  if (!$rootScope.online)
    $state.go('error', {}, {
      location: 'replace'
    });
  $window.addEventListener("offline", function () {
    $rootScope.$apply(function () {
      $rootScope.online = false;
      $state.go('error', {}, {
        location: 'replace'
      });
    });
  }, false);

  $window.addEventListener("online", function () {
    $rootScope.$apply(function () {
      $rootScope.online = true;
      $state.go('home', {}, {
        location: 'replace'
      });
    });
  }, false);
});
