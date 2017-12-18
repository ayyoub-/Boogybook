boogybookApp.controller("ToolCtrl", function($scope, $state, $stateParams, $window) {
  // Vars
  $scope.config = {
    limit: 60,
    total: 0,
    cart: 0,
    mobile: false,
    crop_photo_url: '',
    source: 'computer',
    urls: {
      connection: "https://boogybook.com/web_medias/instagram-request.php",
      photos: "https://boogybook.com/web_medias/instagram-images-refonte.php",
      upload: "https://boogybook.com/web_medias/preprod_scripts/preprod_boogybook_upload.php",
      instagram_more: "https://boogybook.com/web_medias/instagram-more-images-refonte.php",
      improve: "https://boogybook.com/web_medias/preview_refonte_improve.php?img=",
      facebook_improve: "http://boogybook.com/web_medias/preview_facebook_note_page5.php?img=",
      wsrecovery: "https://www.boogybook.com/api/remote_exec?output_format=JSON&rfunc=getJsonByProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ&product="
    },
  }
  /*
  Error messages
   */
  $scope.errors = {
    upload_limit: {
      message: "can not upload more than 60 pictures",
      enable: false
    },
  }
  $scope.tool = {
    /*
    Boogybook Reference
     */
    reference: "",
    /*
    Loading
     */
    progress: 0,
    size: 0,
    /*
     Local images data (tmp)
      */
    localImagesArray: new Array(),
    totalUploadedImages: 0,
    /*
     Global Object
      */
    myLibrary: new Array(),
    myLibraryTexts: new Array(),
    cropIndex: 0
  }
  $scope.cropDetails = {
    cropper: null,
    cropImgPrefix: 'http://medias.boogybook.com/a/',
    zoomParam: 0,
    zoomSize: 0,
    rotateParam: 0,
  }
  $scope.userInfos = null;
  $scope.cart = null;
  // Functions
  // Set local storage
  $scope.setStorage = function() {
    sessionStorage.setItem("myLibrary", JSON.stringify($scope.tool.myLibrary));
  }
  // Get local Storage
  $scope.getStorage = function() {
    if (typeof sessionStorage.getItem("userInfos") != 'undefined' && sessionStorage.getItem("userInfos") != null)
      $scope.userInfos = JSON.parse(sessionStorage.getItem("userInfos"));
    if (typeof sessionStorage.getItem("cart") != 'undefined' && sessionStorage.getItem("cart") != null)
      $scope.cart = JSON.parse(sessionStorage.getItem("cart"));
    if (typeof sessionStorage.getItem("myLibrary") != undefined && sessionStorage.getItem("myLibrary") != null){
      $scope.tool.myLibrary = JSON.parse(sessionStorage.getItem("myLibrary"));
      $scope.tool.size = $scope.tool.myLibrary.length;
    }
  }
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
  // get url parameters
  $scope.getUrlParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }
  /*
   * Trigger input files
   * @returns {undefined}
   */
  $scope.triggerInputFile = function() {
    $("#images:hidden").trigger('click');
  }
  /*
   * AEL
   * Load images from tmp
   * @param {type} e
   * @returns {undefined}
   */
  $scope.loadLocalImages = function(e) {
    var files = e.files || e.files;

    if (!files.length)
      return;
    $scope.createImages(files);
  }
  /*
   *
   * @param {type} files
   * @returns {undefined}
   * Upload images to server, create images links
   */
  $scope.createImages = function(files) {
    /*
     * Load image from tmp & setup arrays (cout, order, crop, crop urls)
     */
    var reader = new FileReader();
    for (var i = 0; i < files.length; i++) {
      var reader_ = new FileReader();
      $scope.config.total++;
      reader_.onload = (e, cropArray) => {
        $scope.tool.localImagesArray.push(e.target.result);
      };
      reader_.readAsDataURL(files[i]);
    }
    /*
     * build formdata from input file
     */
    var formData = new FormData();
    var len = this.checkDataAjaxLength();
    if ($scope.errors.upload_limit.enable)
      alert("Limit error");
    else {
      console.log(len);
      for (var i = 0; i < len; i++)
        formData.append("" + i + "", document.getElementById('images').files[i]);
      formData.append('cart', $scope.config.cart);
      /*
       * Ajax request to upload images
       */
      $scope.uploadRequest(formData);
    }
  }
  /*
  Check the length of ajax upload result
   */
  $scope.checkDataAjaxLength = function() {
    var len = document.getElementById('images').files.length;
    if (len < $scope.tool.size) {
      $scope.errors.upload_limit.enable = true;
      return $scope.tool.size;
    } else {
      $scope.errors.upload_limit.enable = false;
      return len;
    }
  }
  /*
  upload images via ajax to server
  */
  $scope.uploadRequest = function(formData) {
    console.log($scope.config.urls.upload);
    console.log(formData);
    $.ajax({
      url: $scope.config.urls.upload,
      type: 'post',
      data: formData,
      dataType: 'json',
      contentType: false,
      processData: false,
      cache: false,
      success: function(data) {
        /*
        Build items
         */
        $scope.tool.progress = 0;
        var from = $scope.getFirstEmptyItem();
        $scope.addItemsToLibrary(data, from);
        $scope.setStorage();
        $state.go('mySelection', {}, {
          location: 'replace'
        });
      },
      error: function(request) {
        console.error("Error : ");
        console.log(request);
      }
    });
  }
  // Get first empty item
  $scope.getFirstEmptyItem = function() {
    for (var i = 0; i < $scope.config.limit; i++) {
      if (typeof $scope.tool.myLibrary[i] == "undefined")
        return i;
      else if (typeof $scope.tool.myLibrary[i].uid == "undefined")
        return i;
    }
  }
  // Add items to my library
  $scope.addItemsToLibrary = function(data, from) {
    /*
     * Get & save Id & url of loaded images
     */
    for (j = 0; j < data.urls.length; j++) {
      $scope.addItemToLibrary(data.urls[j], from, data.uids[j], 'computer');
      from = $scope.getFirstEmptyItem();
    }
  }
  $scope.addItemToLibrary = function(link, from, uid, source) {
    var item = new Object();
    item.source = source;
    item.ratio_link = $scope.config.urls.improve + "" + link;
    item.server_link = link;
    item.cropObject = new Object();
    item.uid = uid;
    // Calculate position
    item.position = 0;
    /*
     Note book params
     */
    item.cropUrl = '';
    item.text = '';
    item.textSize = 20;
    item.effect = 0;
    item.font = '';
    item.index = from + 1;
    $scope.tool.size--;
    /*
     Add element to library
     */
    $scope.tool.myLibrary[from] = item;
  }
  // Duplicate item
  $scope.duplicateItem = function(index) {
    if (typeof $scope.tool.myLibrary[index + 1] == "undefined") {
      var item = new Object();
      item = $scope.tool.myLibrary[index];
      $scope.tool.myLibrary[index + 1] = new Object();
      $scope.tool.myLibrary[index + 1] = item;
      $scope.tool.size++;
    } else {
      var from = $scope.getFirstEmptyItem();
      while (from != index) {
        $scope.tool.myLibrary[from] = $scope.tool.myLibrary[from - 1];
        from--;
      }
      $scope.tool.size++;
    }
    $scope.setStorage();
  }
  // Delete item
  $scope.deleteItem = function(index) {
    var item = new Object();
    item.index = index;
    $scope.tool.myLibrary[index] = item;
    $scope.tool.size--;
    $scope.setStorage();
  }
  // Edit picture
  $scope.editItem = function(index) {
    $state.go('edit', {
      "index": index
    }, {
      location: 'replace'
    });
  }
  // back
  $scope.backToDetails = function() {
    console.log("back function");
    $window.history.back();
  }
  // Save croped picture
  $scope.saveCrop = function() {
    $.ajax({
      url: "https://boogybook.com/web_medias/preview_refonte.php",
      type: 'post',
      data: {
        'img': $scope.tool.myLibrary[$scope.tool.cropIndex].server_link,
        'crop': JSON.stringify($scope.cropDetails.cropper.getData()),
        'cart': $scope.config.cart
      },
      success: function(data) {
        var result = JSON.parse(data);

        /*
         * Store croped img link
         */
        $scope.tool.myLibrary[$scope.tool.cropIndex].cropUrl = "https://boogybook.com/web_medias/preview_refonte_preview.php?img=" + $scope.cropDetails.cropImgPrefix + "" + result.link + "?cart=" + $scope.config.cart;
        /*
         * Back to @source page
         */
        $scope.setStorage();
        $state.go('mySelection', {}, {
          location: 'replace'
        });
      },
      error: function(request) {
        console.error("Error");
      }
    });
  }
  // Save croped picture
  $scope.resetCrop = function() {
    /*
     * Reset zoom
     */
    var zoom = $scope.cropDetails.zoomParam / 100;
    $scope.cropDetails.cropper.zoom(-$scope.cropDetails.zoomSize);
    $scope.cropDetails.zoomSize = 0;
    $scope.cropDetails.zoomParam = 0;
    /*
     * Reset scale
     */
    var cropInfo = $scope.cropDetails.cropper.getData();
    $scope.cropDetails.cropper.scale(1, 1);
    /*
     * Reset rotation
     */
    $scope.cropDetails.cropper.rotate($scope.cropDetails.rotateParam);
    $scope.cropDetails.rotateParam = 0;
  }
  // Crop functions
  $scope.rotate = function(param) {
    $scope.cropDetails.cropper.rotate(param);
    $scope.cropDetails.rotateParam = $scope.cropDetails.rotateParam - param;
  }
  $scope.scalex = function(x, y) {
    var cropInfo = $scope.cropDetails.cropper.getData();
    if (cropInfo.scaleX == 1)
      $scope.cropDetails.cropper.scale(-1, 1);
    else
      $scope.cropDetails.cropper.scale(1, 1);
  }
  $scope.scaley = function(x, y) {
    var cropInfo = $scope.cropDetails.cropper.getData();
    if (cropInfo.scaleY == 1)
      $scope.cropDetails.cropper.scale(1, -1);
    else
      $scope.cropDetails.cropper.scale(1, 1);
  }
  // MAIN CODE
  $scope.getStorage();
  angular.element(document).ready(function() {
    /*
     * Set up cropper area
     */
    if (typeof $stateParams.index != 'undefined') {
      var image = document.getElementById('image');
      $scope.cropDetails.cropper = new Cropper(image, {
        aspectRatio: 9 / 9,
        autoCropArea: 1,
        viewMode: 1,
        data: $scope.tool.myLibrary[$scope.tool.cropIndex].cropObject,
        strict: true,
        guides: true,
        highlight: false,
        dragCrop: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        zoomable: true,
        movable: true,
        dragMode: 'move',
        minContainerWidth: 350,
        minContainerHeight: 350,
        crop: function(e) {}
      });
    }
  });
  // check if he has an old existing card
  if (typeof($scope.cart) != 'undefined' && $scope.cart != null)
    $scope.config.cart = $scope.cart.id;
  console.log($scope.tool.myLibrary);
  if (typeof $stateParams.index != 'undefined') {
    $scope.tool.cropIndex = $stateParams.index;
    console.log($scope.tool.cropIndex);
  }

});
