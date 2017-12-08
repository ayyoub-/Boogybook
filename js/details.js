$(document).ready(function () {
    $('.btn-details').click(function (e) { 
        e.preventDefault();
        $('.details-produit').toggleClass('blur');
        $('.details-popup').fadeToggle();
    });

    $('.go-back').click(function (e) { 
        e.preventDefault();
        $('.details-produit').toggleClass('blur');
        $('.details-popup').fadeToggle();
    });
});