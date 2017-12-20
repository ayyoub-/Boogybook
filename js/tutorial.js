$(document).ready(function() {
    $('.btn-next').click(function(e) {
        var currentSlide = $('.tutorial-intro').find('.slide.active');
        var currentIndicator = $('.slider-indicators').find('li.active');

        if ($('.slide.active').hasClass('slide-5')) {
            alert('END!')
        } else {
            //Reset
            $('.tutorial-intro').find('.slide').removeClass('active');
            $('.slider-indicators').find('li').removeClass('active');
            //Activate
            currentSlide.next().addClass('active');
            currentIndicator.next().addClass('active');
        }
    });
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
    $('.btn-skip').click(function(e) {
        e.preventDefault();
        alert('END!');
    });
});