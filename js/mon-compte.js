$(document).ready(function() {
    $('.go-back').click(function(e) {
        e.preventDefault();
        alert('xxx');
        var url = window.location;
        window.location = "home.html";
    });
});