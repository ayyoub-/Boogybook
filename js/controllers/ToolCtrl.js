boogybookApp.controller("ToolCtrl", function($scope) {
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
  $scope.errors =  {
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
    size: 60,
    /*
     Local images data (tmp)
      */
    localImagesArray: new Array(),
    totalUploadedImages: 0,
    /*
     Global Object
      */
    myLibrary: new Array(),
    myLibraryTexts: new Array()
  }
  // Functions
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
      if (len > $scope.tool.size) {
          $scope.errors.upload_limit.enable = true;
          return $scope.tools.size;
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
          async: true,
          processData: false,
          contentType: false,
          xhr: function() {
          },
          success: function(data) {
              /*
              Build items
               */
              $scope.tool.progress = 0;
              var from = $scope.getFirstEmptyItem();
              $scope.addItemsToLibrary(data, from);
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
          if (typeof $scope.tool.myLibrary[i].uid == "undefined")
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
      item.ratio_link = this.urls.improve + "" + link;
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
      this.tools.size--;
      /*
       Add element to library
       */
      $scope.tool.myLibrary[from] = item;
  }
});
