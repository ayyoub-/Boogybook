$(document).ready(function () {
    $('.menu-toggle, .overlay').click(function (e) { 
        e.preventDefault();
        $('.overlay').fadeToggle();
        $('.menu-toggle').toggleClass('active');
        $('.side-menu').toggleClass('active');
    });
});