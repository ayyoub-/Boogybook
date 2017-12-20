$(document).ready(function() {
    

    $('#inscription-form').submit(function(e) {
        e.preventDefault();
        var radio = validateRadio($('.radio input'));
        var nom = validate($('.nom input'));
        var prenom = validate($('.prenom input'));
        var email = validate($('.email input'));
        var password = validate($('.password input'));
        var date = validate($('.date-naissance input'));
        if (!radio || !nom || !prenom || !date || !email) {
            swal({
                title: 'Erreur!',
                text: ' Merci de remplir tous les champs obligatoires!',
                type: 'error',
                confirmButtonText: 'Ok'
            })
            return false;
        } else {
            //NEXT STEP
        }
    });

    $('.lettersonly').bind('keyup blur', function() {
        var node = $(this);
        node.val(node.val().replace(/[^a-z]/g, ''));
    });

    $(".numbersonly").keydown(function() {
        var node = $(this);
        node.val(node.val().replace(/[A-z!@#\$%\^\&*\)\(+=._-]+$/g, ''));
    });

    function validate(champ) {
        if (champ.val().length === 0) {
            champ.addClass('error');
            return false;
        } else {
            champ.removeClass('error');
            return true;
        }
    }

    function validateRadio(radio) {
        if (radio.is(':checked')) {
            radio.removeClass('error');
            return true
        } else {
            radio.addClass('error');
            return false;
        }
    }


});
