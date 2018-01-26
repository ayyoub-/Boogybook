boogybookApp.controller("ToolCtrl", function($scope, $anchorScroll, $state, $stateParams, $window, PSAPI, $http, $cordovaCamera, $cordovaImagePicker) {
  // Vars
  $scope.config = {
    limit: 60,
    limitNote: 30,
    limitDuo: 60,
    limitBaby: 30,
    limitBabyXL: 60,
    limitPrime: 30,
    classicPrice: 14.103774,
    notePrice: 12.216981,
    primePrice: 12.216981,
    duoPrice: 14.103774,
    babyPrice: 12.216981,
    babyXlPrice: 14.103774,
    total: 0,
    cart: 0,
    type: 8,
    mobile: false,
    crop_photo_url: '',
    source: 'computer',
    loadingProgress: 0,
    urls: {
      connection: "https://boogybook.com/web_medias/instagram-request.php",
      photos: "https://boogybook.com/web_medias/instagram-images-refonte.php",
      upload: "https://boogybook.com/web_medias/preprod_scripts/preprod_boogybook_upload.php",
      instagram_more: "https://boogybook.com/web_medias/instagram-more-images-refonte.php",
      improve: "https://boogybook.com/web_medias/preview_refonte_classic_page5.php?img=",
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
  $scope.loadingImages = false;
  $scope.cropText = '';
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
    sizeNote: 0,
    sizeDuo: 0,
    sizeBaby: 0,
    sizeBabyXL: 0,
    sizePrime: 0,
    /*
     Local images data (tmp)
      */
    localImagesArray: new Array(),
    totalUploadedImages: 0,
    /*
     Global Object
      */
    myLibrary: new Array(),
    myLibraryNote: new Array(),
    myLibraryDuo: new Array(),
    myLibraryBaby: new Array(),
    myLibraryBabyXL: new Array(),
    myLibraryPrime: new Array(),
    myLibraryTexts: new Array(),
    cropIndex: 0,
    anchorScrollIndex: 0,
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
    sessionStorage.setItem("myLibraryNote", JSON.stringify($scope.tool.myLibraryNote));
    sessionStorage.setItem("myLibraryDuo", JSON.stringify($scope.tool.myLibraryDuo));
    sessionStorage.setItem("myLibraryBaby", JSON.stringify($scope.tool.myLibraryBaby));
    sessionStorage.setItem("myLibraryBabyXL", JSON.stringify($scope.tool.myLibraryBabyXL));
    sessionStorage.setItem("myLibraryPrime", JSON.stringify($scope.tool.myLibraryPrime));
  }
  // Get local Storage
  $scope.getStorage = function() {
    // if (typeof sessionStorage.getItem("userInfos") != 'undefined' && sessionStorage.getItem("userInfos") != null)
    //   $scope.userInfos = JSON.parse(sessionStorage.getItem("userInfos"));
    if (typeof sessionStorage.getItem("cart") != 'undefined' && sessionStorage.getItem("cart") != null)
      $scope.cart = JSON.parse(sessionStorage.getItem("cart"));
    if (typeof sessionStorage.getItem("myLibrary") != undefined && sessionStorage.getItem("myLibrary") != null) {
      $scope.tool.myLibrary = JSON.parse(sessionStorage.getItem("myLibrary"));
      $scope.tool.size = $scope.tool.myLibrary.length;
    }
    if (typeof sessionStorage.getItem("myLibraryNote") != undefined && sessionStorage.getItem("myLibraryNote") != null) {
      $scope.tool.myLibraryNote = JSON.parse(sessionStorage.getItem("myLibraryNote"));
      $scope.tool.sizeNote = $scope.tool.myLibraryNote.length;
    }
    if (typeof sessionStorage.getItem("myLibraryDuo") != undefined && sessionStorage.getItem("myLibraryDuo") != null) {
      $scope.tool.myLibraryDuo = JSON.parse(sessionStorage.getItem("myLibraryDuo"));
      $scope.tool.sizeDuo = $scope.tool.myLibraryDuo.length;
    }
    if (typeof sessionStorage.getItem("myLibraryPrime") != undefined && sessionStorage.getItem("myLibraryPrime") != null) {
      $scope.tool.myLibraryPrime = JSON.parse(sessionStorage.getItem("myLibraryPrime"));
      $scope.tool.sizePrime = $scope.tool.myLibraryPrime.length;
    }
    if (typeof sessionStorage.getItem("myLibraryBaby") != undefined && sessionStorage.getItem("myLibraryBaby") != null) {
      $scope.tool.myLibraryBaby = JSON.parse(sessionStorage.getItem("myLibraryBaby"));
      $scope.tool.sizeBaby = $scope.tool.myLibraryBaby.length;
    }
    if (typeof sessionStorage.getItem("myLibraryBabyXL") != undefined && sessionStorage.getItem("myLibraryBabyXL") != null) {
      $scope.tool.myLibraryBabyXL = JSON.parse(sessionStorage.getItem("myLibraryBabyXL"));
      $scope.tool.sizeBabyXL = $scope.tool.myLibraryBabyXL.length;
    }
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
    $scope.createImages(files, $scope.config.type);
  }
  /*
   *
   * @param {type} files
   * @returns {undefined}
   * Upload images to server, create images links
   */
  $scope.createImages = function(files, type) {
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
    var len = this.checkDataAjaxLength(type);
    if ($scope.errors.upload_limit.enable)
      alert("Limit error");
    else {
      // Activate loading overlay
      $scope.loadingImages = true;
      $(".upload-progress").addClass("active");
      for (var i = 0; i < len; i++)
        formData.append("" + i + "", document.getElementById('images').files[i]);
      formData.append('cart', $scope.config.cart);
      /*
       * Ajax request to upload images
       */
      $scope.uploadRequest(formData, type);
    }
  }
  $scope.getElementById = function(id, library) {
    indexs = Array();
    for (var i = library.length - 1; i >= 0; i--) {
      if (library[i].uid == id) {
        indexs.push(i);
      }
    }
    return indexs;
  }
  /*
  Check the length of ajax upload result
   */
  $scope.checkDataAjaxLength = function(type) {
    if (type == 8) {
      var len = document.getElementById('images').files.length;
      if (len > ($scope.config.limit - $scope.tool.size)) {
        $scope.errors.upload_limit.enable = true;
        return $scope.tool.size;
      } else {
        $scope.errors.upload_limit.enable = false;
        return len;
      }
    } else if (type == 15133) {
      var len = document.getElementById('images').files.length;
      if (len > ($scope.config.limitDuo - $scope.tool.sizeDuo)) {
        $scope.errors.upload_limit.enable = true;
        return $scope.tool.sizeDuo;
      } else {
        $scope.errors.upload_limit.enable = false;
        return len;
      }
    }
    else if (type == 15135) {
      var len = document.getElementById('images').files.length;
      if (len > ($scope.config.limitPrime - $scope.tool.sizePrime)) {
        $scope.errors.upload_limit.enable = true;
        return $scope.tool.sizePrime;
      } else {
        $scope.errors.upload_limit.enable = false;
        return len;
      }
    }
    else if (type == 15137) {
      var len = document.getElementById('images').files.length;
      if (len > ($scope.config.limitBaby - $scope.tool.sizeBaby)) {
        $scope.errors.upload_limit.enable = true;
        return $scope.tool.sizeBaby;
      } else {
        $scope.errors.upload_limit.enable = false;
        return len;
      }
    }
    else if (type == 15138) {
      var len = document.getElementById('images').files.length;
      if (len > ($scope.config.limitBabyXL - $scope.tool.sizeBabyXL)) {
        $scope.errors.upload_limit.enable = true;
        return $scope.tool.sizeBabyXL;
      } else {
        $scope.errors.upload_limit.enable = false;
        return len;
      }
    } else {
      var len = document.getElementById('images').files.length;
      if (len > ($scope.config.limitNote - $scope.tool.sizeNote)) {
        $scope.errors.upload_limit.enable = true;
        return $scope.tool.sizeNote;
      } else {
        $scope.errors.upload_limit.enable = false;
        return len;
      }
    }
  }
  /*
  upload images via ajax to server
  */
  $scope.uploadRequest = function(formData, type) {
    $.ajax({
      url: $scope.config.urls.upload,
      type: 'post',
      data: formData,
      dataType: 'json',
      contentType: false,
      processData: false,
      cache: false,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            $scope.config.loadingProgress = Math.floor(percentComplete * 100);
            $("#loadingProgress").html(Math.floor(percentComplete * 100));
          }
        }, false);
        return xhr;
      },
      success: function(data) {
        /*
        Build items
         */
        $scope.tool.progress = 0;
        var from = $scope.getFirstEmptyItem(type);
        $scope.addItemsToLibrary(data, from, type);
        $scope.setStorage();
        $scope.loadingImages = false;
        $(".upload-progress").removeClass("active");
        $("#loadingProgress").html(0);
        $scope.setStorage();
        $state.go('mySelection', {
          "type": $scope.config.type,
        }, {
          location: 'replace'
        });
      },
      error: function(request) {
        console.error("Error : ");
      }
    });
  }
  // Get first empty item
  $scope.getFirstEmptyItem = function(type) {
    if (type == 8) {
      for (var i = 0; i < $scope.config.limit; i++) {
        if (typeof $scope.tool.myLibrary[i] == "undefined")
          return i;
        else if (typeof $scope.tool.myLibrary[i].uid == "undefined")
          return i;
      }
    }
    else if (type == 15135) {
      for (var i = 0; i < $scope.config.limitPrime; i++) {
        if (typeof $scope.tool.myLibraryPrime[i] == "undefined")
          return i;
        else if (typeof $scope.tool.myLibraryPrime[i].uid == "undefined")
          return i;
      }
    }
    else if (type == 15137) {
      for (var i = 0; i < $scope.config.limitBaby; i++) {
        if (typeof $scope.tool.myLibraryBaby[i] == "undefined")
          return i;
        else if (typeof $scope.tool.myLibraryBaby[i].uid == "undefined")
          return i;
      }
    }
    else if (type == 15138) {
      for (var i = 0; i < $scope.config.limitBabyXL; i++) {
        if (typeof $scope.tool.myLibraryBabyXL[i] == "undefined")
          return i;
        else if (typeof $scope.tool.myLibraryBabyXL[i].uid == "undefined")
          return i;
      }
    } else if (type == 15133) {
      for (var i = 0; i < $scope.config.limitDuo; i++) {
        if (typeof $scope.tool.myLibraryDuo[i] == "undefined")
          return i;
        else if (typeof $scope.tool.myLibraryDuo[i].uid == "undefined")
          return i;
      }
    } else {
      for (var i = 0; i < $scope.config.limitNote; i++) {
        if (typeof $scope.tool.myLibraryNote[i] == "undefined")
          return i;
        else if (typeof $scope.tool.myLibraryNote[i].uid == "undefined")
          return i;
      }
    }

  }
  // Add items to my library
  $scope.addItemsToLibrary = function(data, from, type) {
    /*
     * Get & save Id & url of loaded images
     */
    for (j = 0; j < data.urls.length; j++) {
      $scope.addItemToLibrary(data.urls[j], from, data.uids[j], 'computer', type);
      from = $scope.getFirstEmptyItem(type);
    }
    $scope.setStorage();
  }
  $scope.addItemToLibrary = function(link, from, uid, source, type) {
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
    item.type = $scope.config.type;
    item.index = from + 1;
    /*
     Add element to library
     */
    if (type == 8) {
      $scope.tool.myLibrary[from] = item;
      $scope.tool.size++;
    }
    else if (type == 15135) {
      $scope.tool.myLibraryPrime[from] = item;
      $scope.tool.sizePrime++;
    }
    else if (type == 15137) {
      $scope.tool.myLibraryBaby[from] = item;
      $scope.tool.sizeBaby++;
    }
    else if (type == 15138) {
      $scope.tool.myLibraryBabyXL[from] = item;
      $scope.tool.sizeBabyXL++;
    }
    else if (type == 15133) {
      $scope.tool.myLibraryDuo[from] = item;
      $scope.tool.myLibraryDuo[from + 1] = item;
      $scope.tool.sizeDuo++;
      $scope.tool.sizeDuo++;
    } else {
      $scope.tool.myLibraryNote[from] = item;
      $scope.tool.sizeNote++;
    }
    $scope.setStorage();
  }
  // Duplicate item
  $scope.duplicateItem = function(index, type) {
    if (type == 8) {
      if (typeof $scope.tool.myLibrary[index + 1] == "undefined") {
        var item = new Object();
        item = $scope.tool.myLibrary[index];
        $scope.tool.myLibrary[index + 1] = new Object();
        $scope.tool.myLibrary[index + 1] = item;
        $scope.tool.size++;
      } else {
        var from = $scope.getFirstEmptyItem(type);
        while (from != index) {
          $scope.tool.myLibrary[from] = $scope.tool.myLibrary[from - 1];
          from--;
        }
        $scope.tool.size++;
      }
    }
    else if (type == 15135) {
      if (typeof $scope.tool.myLibraryPrime[index + 1] == "undefined") {
        var item = new Object();
        item = $scope.tool.myLibraryPrime[index];
        $scope.tool.myLibraryPrime[index + 1] = new Object();
        $scope.tool.myLibraryPrime[index + 1] = item;
        $scope.tool.sizePrime++;
      } else {
        var from = $scope.getFirstEmptyItem(type);
        while (from != index) {
          $scope.tool.myLibraryPrime[from] = $scope.tool.myLibraryPrime[from - 1];
          from--;
        }
        $scope.tool.sizePrime++;
      }
    }
    else if (type == 15137) {
      if (typeof $scope.tool.myLibraryBaby[index + 1] == "undefined") {
        var item = new Object();
        item = $scope.tool.myLibraryBaby[index];
        $scope.tool.myLibraryBaby[index + 1] = new Object();
        $scope.tool.myLibraryBaby[index + 1] = item;
        $scope.tool.sizeBaby++;
      } else {
        var from = $scope.getFirstEmptyItem(type);
        while (from != index) {
          $scope.tool.myLibraryBaby[from] = $scope.tool.myLibraryBaby[from - 1];
          from--;
        }
        $scope.tool.sizeBaby++;
      }
    }
    else if (type == 15138) {
      if (typeof $scope.tool.myLibraryBabyXL[index + 1] == "undefined") {
        var item = new Object();
        item = $scope.tool.myLibraryBabyXL[index];
        $scope.tool.myLibraryBabyXL[index + 1] = new Object();
        $scope.tool.myLibraryBabyXL[index + 1] = item;
        $scope.tool.sizeBabyXL++;
      } else {
        var from = $scope.getFirstEmptyItem(type);
        while (from != index) {
          $scope.tool.myLibraryBabyXL[from] = $scope.tool.myLibraryBabyXL[from - 1];
          from--;
        }
        $scope.tool.sizeBabyXL++;
      }
    } else if (type == 15133) {
      if (typeof $scope.tool.myLibraryDuo[index + 1] == "undefined") {
        var item = new Object();
        item = $scope.tool.myLibraryDuo[index];
        $scope.tool.myLibraryDuo[index + 1] = new Object();
        $scope.tool.myLibraryDuo[index + 1] = item;
        $scope.tool.myLibraryDuo[index + 2] = new Object();
        $scope.tool.myLibraryDuo[index + 2] = item;
        $scope.tool.sizeDuo++;
        $scope.tool.sizeDuo++;
      } else {
        var from = $scope.getFirstEmptyItem(type);
        while (from > index) {
          $scope.tool.myLibraryDuo[from+1] = $scope.tool.myLibraryDuo[from - 1];
          $scope.tool.myLibraryDuo[from] = $scope.tool.myLibraryDuo[from - 2];
          from = from - 2;
        }
        if($scope.tool.sizeDuo > 0)
        $scope.tool.sizeDuo += 2;
      }
    } else {
      if (typeof $scope.tool.myLibraryNote[index + 1] == "undefined") {
        var item = new Object();
        item = $scope.tool.myLibraryNote[index];
        $scope.tool.myLibraryNote[index + 1] = new Object();
        $scope.tool.myLibraryNote[index + 1] = item;
        $scope.tool.sizeNote++;
      } else {
        var from = $scope.getFirstEmptyItem(type);
        while (from != index) {
          $scope.tool.myLibraryNote[from] = $scope.tool.myLibraryNote[from - 1];
          from--;
        }
        $scope.tool.sizeNote++;
      }
    }

    $scope.setStorage();
  }
  // Delete item
  $scope.deleteItem = function(index, type) {
    if (type == 8) {
      var item = new Object();
      item.index = index;
      $scope.tool.myLibrary.splice(index, 1);
      $scope.tool.size--;
    }
    else if (type == 15135) {
      var item = new Object();
      item.index = index;
      $scope.tool.myLibraryPrime.splice(index, 1);
      $scope.tool.sizePrime--;
    }
    else if (type == 15137) {
      var item = new Object();
      item.index = index;
      $scope.tool.myLibraryBaby.splice(index, 1);
      $scope.tool.sizeBaby--;
    }
    else if (type == 15138) {
      var item = new Object();
      item.index = index;
      $scope.tool.myLibraryBabyXL.splice(index, 1);
      $scope.tool.sizeBabyXL--;
    }
    else if (type == 15133) {
      var indexs = $scope.getElementById($scope.tool.myLibraryDuo[index].uis, $scope.tool.myLibraryDuo);
      indexs.reverse();
      var i = 0;
      while (i < 2) {
        var item = new Object();
        item.index = indexs[i];
        $scope.tool.myLibraryDuo.splice(indexs[i], 1);
        $scope.tool.sizeDuo--;
        i++;
      }
    } else {
      var item = new Object();
      item.index = index;
      $scope.tool.myLibraryNote.splice(index, 1);
      $scope.tool.sizeNote--;
    }
    $scope.setStorage();
  }
  $scope.croptChangeText = function(index) {
    $scope.setStorage();
  }
  // Edit picture
  $scope.editItem = function(index, type) {
    if ($scope.config.type == 10) {
      $state.go('note-crop-tool', {
        "index": index,
        "type": type
      }, {
        location: 'replace'
      });
    } else
      $state.go('edit', {
        "index": index,
        "type": type
      }, {
        location: 'replace'
      });
  }
  // back
  $scope.backToDetails = function() {
    $window.history.back();
  }
  $scope.backToSelection = function(type) {
    $state.go('mySelection', {
      type: type,
    }, {
      location: 'replace'
    });
  }
  $scope.addEffect = function(effect) {
    switch (effect) {
      case 1:
        if ($scope.tool.myLibraryNote[$scope.tool.cropIndex].effect != 1) {
          $('.cropper-view-box img').css("-webkit-filter", "none");
          $('.cropper-view-box img').css("-webkit-filter", "grayscale(80%)");
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = effect;
        } else if ($scope.tool.myLibraryNote[$scope.tool.cropIndex].effect == 1) {
          $('.cropper-view-box img').css("-webkit-filter", "none");
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = 0;
        }
        break;
      case 2:
        if ($scope.tool.myLibraryNote[$scope.tool.cropIndex].effect != 2) {
          $('.cropper-view-box img').css("-webkit-filter", "none");
          $('.cropper-view-box img').css("-webkit-filter", "sepia(0.6)");
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = effect;
        } else if ($scope.tool.myLibraryNote[$scope.tool.cropIndex].effect == 2) {
          $('.cropper-view-box img').css("-webkit-filter", "none");
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = 0;
        }
        break;
      case 3:
        if ($scope.tool.myLibraryNote[$scope.tool.cropIndex].effect != 3) {
          $('.cropper-view-box img').css("-webkit-filter", "none");
          $('.cropper-view-box img').css("-webkit-filter", "invert(0.2)");
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = effect;
        } else if (this.myPDF[this.tools.index].effect == 3) {
          $('.cropper-view-box img').css("-webkit-filter", "none");
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = 0;
        }
        break;
      case 4:
        if ($scope.tool.myLibraryNote[$scope.tool.cropIndex].effect != 4) {
          $('.cropper-view-box img').css("-webkit-filter", "none");
          $('.cropper-view-box img').css("-webkit-filter", "invert(0)");
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = effect;
        } else if ($scope.tool.myLibraryNote[$scope.tool.cropIndex].effect == 4) {
          $('.cropper-view-box img').css("-webkit-filter", "none");
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = 0;
        }
        break;
    }
    $scope.setStorage();
  }
  // Clear local storage
  $scope.cleanStorage = function(type) {
    if (type == 8) {
      var i = sessionStorage.length;
      while (i--) {
        var key = sessionStorage.key(i);
        sessionStorage.removeItem(key);
      }
      $scope.tool.myLibrary = new Array();
      $scope.tool.size = 0;
    }
    else if (type == 15135) {
      var i = sessionStorage.length;
      while (i--) {
        var key = sessionStorage.key(i);
        sessionStorage.removeItem(key);
      }
      $scope.tool.myLibraryPrime = new Array();
      $scope.tool.sizePrime = 0;
    }
    else if (type == 15137) {
      var i = sessionStorage.length;
      while (i--) {
        var key = sessionStorage.key(i);
        sessionStorage.removeItem(key);
      }
      $scope.tool.myLibraryBaby = new Array();
      $scope.tool.sizeBaby = 0;
    }
    else if (type == 15138) {
      var i = sessionStorage.length;
      while (i--) {
        var key = sessionStorage.key(i);
        sessionStorage.removeItem(key);
      }
      $scope.tool.myLibraryBabyXL = new Array();
      $scope.tool.sizeBabyXL = 0;
    }
    if (type == 15133) {
      var i = sessionStorage.length;
      while (i--) {
        var key = sessionStorage.key(i);
        sessionStorage.removeItem(key);
      }
      $scope.tool.myLibraryDuo = new Array();
      $scope.tool.sizeDuo = 0;
    } else {
      var i = sessionStorage.length;
      while (i--) {
        var key = sessionStorage.key(i);
        sessionStorage.removeItem(key);
      }
      $scope.tool.myLibraryNote = new Array();
      $scope.tool.sizeNote = 0;
    }
  }
  // Add product to cart
  $scope.submitBoogybook = function() {
    $(".upload-progress-creation").addClass("active");
    var ratioImagesArray = new Array();
    var imageUidsArray = new Array();
    var countArray = new Array();
    var cropImageArray = new Array();
    for (var i = 0; i < $scope.tool.myLibrary.length; i++) {
      ratioImagesArray.push($scope.tool.myLibrary[i].server_link);
      imageUidsArray.push($scope.tool.myLibrary[i].uid);
      cropImageArray.push($scope.tool.myLibrary[i].cropObject);
      countArray.push(1);
    }
    $http({
      url: 'http://www.boogybook.com/api/remote_exec?rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ?url=remote_exec&rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
      method: "POST",
      data: 'cropImageArray=' + JSON.stringify(cropImageArray) + '&ratioImagesArray=' + JSON.stringify(ratioImagesArray) + '&imageUidsArray=' + imageUidsArray + '&cart=' + $scope.config.cart + '&price='+$scope.config.classicPrice,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status, headers, config) {
      $(".upload-progress-creation").removeClass("active");
      if (data.OK) {
        $state.go('cart_recap', {}, {
          location: 'replace'
        });
      }
    }).error(function(data, status, headers, config) {});
  }
  $scope.submitNotebook = function() {
    $(".upload-progress-creation").addClass("active");
    var ratioImagesArray = new Array();
    var imageUidsArray = new Array();
    var countArray = new Array();
    var cropImageArray = new Array();
    for (var i = 0; i < $scope.tool.myLibraryNote.length; i++) {
      ratioImagesArray.push($scope.tool.myLibraryNote[i].server_link);
      imageUidsArray.push($scope.tool.myLibraryNote[i].uid);
      cropImageArray.push($scope.tool.myLibraryNote[i].cropObject);
      countArray.push(1);
    }
    $http({
      url: 'http://www.boogybook.com/api/remote_exec?rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ?url=remote_exec&rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
      method: "POST",
      data: 'cropImageArray=' + JSON.stringify(cropImageArray) + '&ratioImagesArray=' + JSON.stringify(ratioImagesArray) + '&imageUidsArray=' + imageUidsArray + '&cart=' + $scope.config.cart + '&type=NoteBook'+ '&price='+$scope.config.notePrice,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status, headers, config) {
      $(".upload-progress-creation").removeClass("active");
      if (data.OK) {
        $state.go('cart_recap', {}, {
          location: 'replace'
        });
      }
    }).error(function(data, status, headers, config) {});
  }
  $scope.submitBoogyDuo = function() {
    $(".upload-progress-creation").addClass("active");
    var ratioImagesArray = new Array();
    var imageUidsArray = new Array();
    var countArray = new Array();
    var cropImageArray = new Array();
    for (var i = 0; i < $scope.tool.myLibraryDuo.length; i++) {
      ratioImagesArray.push($scope.tool.myLibraryDuo[i].server_link);
      imageUidsArray.push($scope.tool.myLibraryDuo[i].uid);
      cropImageArray.push($scope.tool.myLibraryDuo[i].cropObject);
      countArray.push(1);
    }
    $http({
      url: 'http://www.boogybook.com/api/remote_exec?rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ?url=remote_exec&rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
      method: "POST",
      data: 'cropImageArray=' + JSON.stringify(cropImageArray) + '&ratioImagesArray=' + JSON.stringify(ratioImagesArray) + '&imageUidsArray=' + imageUidsArray + '&cart=' + $scope.config.cart + '&type=BoogyDuo'+ '&price='+$scope.config.duoPrice,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status, headers, config) {
      $(".upload-progress-creation").removeClass("active");
      if (data.OK) {
        $state.go('cart_recap', {}, {
          location: 'replace'
        });
      }
    }).error(function(data, status, headers, config) {});
  }
  $scope.submitBoogyBabyXL = function() {
    $(".upload-progress-creation").addClass("active");
    var ratioImagesArray = new Array();
    var imageUidsArray = new Array();
    var countArray = new Array();
    var cropImageArray = new Array();
    for (var i = 0; i < $scope.tool.myLibraryBabyXL.length; i++) {
      ratioImagesArray.push($scope.tool.myLibraryBabyXL[i].server_link);
      imageUidsArray.push($scope.tool.myLibraryBabyXL[i].uid);
      cropImageArray.push($scope.tool.myLibraryBabyXL[i].cropObject);
      countArray.push(1);
    }
    $http({
      url: 'http://www.boogybook.com/api/remote_exec?rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ?url=remote_exec&rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
      method: "POST",
      data: 'cropImageArray=' + JSON.stringify(cropImageArray) + '&ratioImagesArray=' + JSON.stringify(ratioImagesArray) + '&imageUidsArray=' + imageUidsArray + '&cart=' + $scope.config.cart + '&type=BoogyBabyXL'+ '&price='+$scope.config.babyXlPrice,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status, headers, config) {
      $(".upload-progress-creation").removeClass("active");
      if (data.OK) {
        $state.go('cart_recap', {}, {
          location: 'replace'
        });
      }
    }).error(function(data, status, headers, config) {});
  }
  $scope.submitBoogyBaby = function() {
    $(".upload-progress-creation").addClass("active");
    var ratioImagesArray = new Array();
    var imageUidsArray = new Array();
    var countArray = new Array();
    var cropImageArray = new Array();
    for (var i = 0; i < $scope.tool.myLibraryBaby.length; i++) {
      ratioImagesArray.push($scope.tool.myLibraryBaby[i].server_link);
      imageUidsArray.push($scope.tool.myLibraryBaby[i].uid);
      cropImageArray.push($scope.tool.myLibraryBaby[i].cropObject);
      countArray.push(1);
    }
    $http({
      url: 'http://www.boogybook.com/api/remote_exec?rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ?url=remote_exec&rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
      method: "POST",
      data: 'cropImageArray=' + JSON.stringify(cropImageArray) + '&ratioImagesArray=' + JSON.stringify(ratioImagesArray) + '&imageUidsArray=' + imageUidsArray + '&cart=' + $scope.config.cart + '&type=BoogyBaby'+ '&price='+$scope.config.babyPrice,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status, headers, config) {
      $(".upload-progress-creation").removeClass("active");
      if (data.OK) {
        $state.go('cart_recap', {}, {
          location: 'replace'
        });
      }
    }).error(function(data, status, headers, config) {});
  }
  $scope.submitBoogyPrime = function() {
    $(".upload-progress-creation").addClass("active");
    var ratioImagesArray = new Array();
    var imageUidsArray = new Array();
    var countArray = new Array();
    var cropImageArray = new Array();
    for (var i = 0; i < $scope.tool.myLibraryPrime.length; i++) {
      ratioImagesArray.push($scope.tool.myLibraryPrime[i].server_link);
      imageUidsArray.push($scope.tool.myLibraryPrime[i].uid);
      cropImageArray.push($scope.tool.myLibraryPrime[i].cropObject);
      countArray.push(1);
    }
    $http({
      url: 'http://www.boogybook.com/api/remote_exec?rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ?url=remote_exec&rfunc=addNewCustomerProduct&ws_key=WJV16DU4WGZB5Z7VXMKP5NV85UMC8YPZ',
      method: "POST",
      data: 'cropImageArray=' + JSON.stringify(cropImageArray) + '&ratioImagesArray=' + JSON.stringify(ratioImagesArray) + '&imageUidsArray=' + imageUidsArray + '&cart=' + $scope.config.cart + '&type=BoogyPrime'+ '&price='+$scope.config.primePrice,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status, headers, config) {
      $(".upload-progress-creation").removeClass("active");
      if (data.OK) {
        $state.go('cart_recap', {}, {
          location: 'replace'
        });
      }
    }).error(function(data, status, headers, config) {});
  }
  // Save croped picture
  $scope.saveCrop = function() {
    if ($scope.config.type == 8) {
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
          $scope.tool.myLibrary[$scope.tool.cropIndex].cropUrl = "https://boogybook.com/web_medias/preview_refonte_classic_page5.php?img=" + $scope.cropDetails.cropImgPrefix + "" + result.link + "?cart=" + $scope.config.cart;
          /*
           * Back to @source page
           */
          $scope.setStorage();
          $state.go('mySelection', {
            "index": $scope.tool.cropIndex,
            "type": $scope.config.type
          }, {
            location: 'replace'
          });
        },
        error: function(request) {
          console.error("Error");
        }
      });
    }
    if ($scope.config.type == 15135) {
      $.ajax({
        url: "https://boogybook.com/web_medias/preview_refonte.php",
        type: 'post',
        data: {
          'img': $scope.tool.myLibraryPrime[$scope.tool.cropIndex].server_link,
          'crop': JSON.stringify($scope.cropDetails.cropper.getData()),
          'cart': $scope.config.cart
        },
        success: function(data) {
          var result = JSON.parse(data);

          /*
           * Store croped img link
           */
          $scope.tool.myLibraryPrime[$scope.tool.cropIndex].cropUrl = "https://boogybook.com/web_medias/preview_refonte_classic_page5.php?img=" + $scope.cropDetails.cropImgPrefix + "" + result.link + "?cart=" + $scope.config.cart;
          /*
           * Back to @source page
           */
          $scope.setStorage();
          $state.go('mySelection', {
            "index": $scope.tool.cropIndex,
            "type": $scope.config.type
          }, {
            location: 'replace'
          });
        },
        error: function(request) {
          console.error("Error");
        }
      });
    }
    if ($scope.config.type == 15137) {
      $.ajax({
        url: "https://boogybook.com/web_medias/preview_refonte.php",
        type: 'post',
        data: {
          'img': $scope.tool.myLibraryBaby[$scope.tool.cropIndex].server_link,
          'crop': JSON.stringify($scope.cropDetails.cropper.getData()),
          'cart': $scope.config.cart
        },
        success: function(data) {
          var result = JSON.parse(data);

          /*
           * Store croped img link
           */
          $scope.tool.myLibraryBaby[$scope.tool.cropIndex].cropUrl = "https://boogybook.com/web_medias/preview_refonte_classic_page5.php?img=" + $scope.cropDetails.cropImgPrefix + "" + result.link + "?cart=" + $scope.config.cart;
          /*
           * Back to @source page
           */
          $scope.setStorage();
          $state.go('mySelection', {
            "index": $scope.tool.cropIndex,
            "type": $scope.config.type
          }, {
            location: 'replace'
          });
        },
        error: function(request) {
          console.error("Error");
        }
      });
    }
    if ($scope.config.type == 15138) {
      $.ajax({
        url: "https://boogybook.com/web_medias/preview_refonte.php",
        type: 'post',
        data: {
          'img': $scope.tool.myLibraryBabyXL[$scope.tool.cropIndex].server_link,
          'crop': JSON.stringify($scope.cropDetails.cropper.getData()),
          'cart': $scope.config.cart
        },
        success: function(data) {
          var result = JSON.parse(data);

          /*
           * Store croped img link
           */
          $scope.tool.myLibraryBabyXL[$scope.tool.cropIndex].cropUrl = "https://boogybook.com/web_medias/preview_refonte_classic_page5.php?img=" + $scope.cropDetails.cropImgPrefix + "" + result.link + "?cart=" + $scope.config.cart;
          /*
           * Back to @source page
           */
          $scope.setStorage();
          $state.go('mySelection', {
            "index": $scope.tool.cropIndex,
            "type": $scope.config.type
          }, {
            location: 'replace'
          });
        },
        error: function(request) {
          console.error("Error");
        }
      });
    } else if ($scope.config.type == 15133) {
      $.ajax({
        url: "https://boogybook.com/web_medias/preview_refonte.php",
        type: 'post',
        data: {
          'img': $scope.tool.myLibraryDuo[$scope.tool.cropIndex].server_link,
          'crop': JSON.stringify($scope.cropDetails.cropper.getData()),
          'cart': $scope.config.cart
        },
        success: function(data) {
          var result = JSON.parse(data);

          /*
           * Store croped img link
           */
          $scope.tool.myLibraryDuo[$scope.tool.cropIndex].cropUrl = "https://boogybook.com/web_medias/preview_refonte_classic_page5.php?img=" + $scope.cropDetails.cropImgPrefix + "" + result.link + "?cart=" + $scope.config.cart;
          /*
           * Back to @source page
           */
          $scope.setStorage();
          $state.go('mySelection', {
            "index": $scope.tool.cropIndex,
            "type": $scope.config.type
          }, {
            location: 'replace'
          });
        },
        error: function(request) {
          console.error("Error");
        }
      });
    } else {
      $.ajax({
        url: "https://boogybook.com/web_medias/preview_refonte.php",
        type: 'post',
        data: {
          'img': $scope.tool.myLibraryNote[$scope.tool.cropIndex].server_link,
          'crop': JSON.stringify($scope.cropDetails.cropper.getData()),
          'cart': $scope.config.cart
        },
        success: function(data) {
          var result = JSON.parse(data);

          /*
           * Store croped img link
           */
          $scope.tool.myLibraryNote[$scope.tool.cropIndex].cropUrl = "https://boogybook.com/web_medias/preview_refonte_preview.php?img=" + $scope.cropDetails.cropImgPrefix + "" + result.link + "?cart=" + $scope.config.cart;
          /*
           * Back to @source page
           */
          $scope.setStorage();
          $state.go('mySelection', {
            "index": $scope.tool.cropIndex,
            "type": $scope.config.type
          }, {
            location: 'replace'
          });
        },
        error: function(request) {
          console.error("Error");
        }
      });
    }
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
    if ($scope.config.type == 10) {
      $scope.tool.myLibraryNote[$scope.tool.cropIndex].effect = 0;
      $('.cropper-view-box img').css("-webkit-filter", "none");
    }

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
  // scroll by id
  $scope.scrollTo = function(id) {
    $anchorScroll(id);
  }
  // MAIN CODE
  $scope.getStorage();
  angular.element(document).ready(function() {
    /*
     * Set up cropper area
     */
    if (typeof $stateParams.index != 'undefined' && ($state.$current.self.name == 'edit' || $state.$current.self.name == 'note-crop-tool' || $state.$current.self.name == 'note-filter-tool' || $state.$current.self.name == 'note-text-tool')) {
      var image = document.getElementById('image');
      if ($scope.config.type == 10) {
        $scope.cropDetails.cropper = new Cropper(image, {
          aspectRatio: 9 / 9,
          autoCropArea: 1,
          viewMode: 1,
          data: $scope.tool.myLibraryNote[$scope.tool.cropIndex].cropObject,
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
      else if ($scope.config.type == 15135) {
        $scope.cropDetails.cropper = new Cropper(image, {
          aspectRatio: 9 / 9,
          autoCropArea: 1,
          viewMode: 1,
          data: $scope.tool.myLibraryPrime[$scope.tool.cropIndex].cropObject,
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
      else if ($scope.config.type == 15137) {
        $scope.cropDetails.cropper = new Cropper(image, {
          aspectRatio: 9 / 9,
          autoCropArea: 1,
          viewMode: 1,
          data: $scope.tool.myLibraryBaby[$scope.tool.cropIndex].cropObject,
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
      else if ($scope.config.type == 15138) {
        $scope.cropDetails.cropper = new Cropper(image, {
          aspectRatio: 9 / 9,
          autoCropArea: 1,
          viewMode: 1,
          data: $scope.tool.myLibraryBabyXL[$scope.tool.cropIndex].cropObject,
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
      } else if ($scope.config.type == 15133) {
        $scope.cropDetails.cropper = new Cropper(image, {
          aspectRatio: 12 / 8,
          autoCropArea: 1,
          viewMode: 1,
          data: $scope.tool.myLibraryDuo[$scope.tool.cropIndex].cropObject,
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
      } else {
        $scope.cropDetails.cropper = new Cropper(image, {
          aspectRatio: 12 / 8,
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

    } else if (typeof $stateParams.index != 'undefined' && $state.$current.self.name != 'edit') {
      $scope.tool.anchorScrollIndex = $stateParams.index;
      var id = '' + $scope.tool.myLibrary[$scope.tool.anchorScrollIndex].uid + '-' + $stateParams.index;
      var el = document.getElementById(id);
      el.scrollIntoView(true);
    }
  });
  // check if he has an old existing card
  if (typeof($scope.cart) != 'undefined' && $scope.cart != null)
    $scope.config.cart = $scope.cart.id;
  if (typeof $stateParams.index != 'undefined') {
    $scope.tool.cropIndex = $stateParams.index;
    $scope.tool.anchorScrollIndex = $stateParams.index;
  } else {
    $scope.tool.cropIndex = -1;
    $scope.tool.anchorScrollIndex = 0;
  }
  console.log(parseInt($stateParams.type));
  if (parseInt(parseInt($stateParams.type)) == 10) {
    $scope.config.type = 10;
  } else if (parseInt($stateParams.type) == 15133) {
    $scope.config.type = 15133;
  }
  else if (parseInt($stateParams.type) == 15138) {
    $scope.config.type = 15138;
  }
  else if (parseInt($stateParams.type) == 15137) {
    $scope.config.type = 15137;
  }
  else if (parseInt($stateParams.type) == 15135) {
    $scope.config.type = 15135;
  }
  console.log($scope.config);
  console.log($scope.tool);
});
