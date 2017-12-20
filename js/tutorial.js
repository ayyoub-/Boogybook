$(document).ready(function() {
    $('.slider-indicators li').click(function(e) {
        e.preventDefault();
        var current = '.' + $(this).data('slide');
        //Reset
        $('.tutorial-intro').find('.slide').removeClass('active');
        $('.slider-indicators').find('li').removeClass('active');
        //Activate
        $(this).addClass('active');
        $(current).addClass('active');
    });
});
