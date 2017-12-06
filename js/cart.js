$(document).ready(function() {
    $('.btn-add').click(function(e) {
        e.preventDefault();
        var qte = parseInt($(this).parent().find('.qte-input').val());
        qte++;
        $(this).parent().find('.qte-input').val(qte);
    });
    $('.btn-remove').click(function(e) {
        e.preventDefault();
        var qte = parseInt($(this).parent().find('.qte-input').val());
        qte--;
        $(this).parent().find('.qte-input').val(qte);
    });

    $('.remove-item').click(function(e) {
        e.preventDefault();
        $(this).parent().parent().remove();

    });
});