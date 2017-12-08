$(document).ready(function () {
    $('.menu-toggle, .overlay, .menu-list li a').click(function (e) { 
        e.preventDefault();
        $('.overlay').fadeToggle();
        $('.menu-toggle').toggleClass('active');
        $('.side-menu').toggleClass('active');
    });
});