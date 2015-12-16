
$(function() {

    $('#login-form-link').click(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

    // Process the Login Action
    $('#login-submit').click(function(e){
        alert("Login Process");
        var username = $('#username').val();
        var password = $('#password').val();
        var data = { "username": username };
        alert(username + "  " + password);
        $.ajax({
            url:'/login',
            type:'POST',
            data:data
        });
    });

    // Process the Login Action
    $('#register-submit').click(function(e){
        alert("Register Process");
        var username = $('#username').val();
        var password = $('#password').val();
        var conform_password = $('#confirm-password').val();
        if(password != conform_password) {
            alert("The password and conform password not consisted");
        } else {
            $.ajax({
                url:'/register',
                type:'POST',
                data:data
            });
        }


    })
});


function login(){

}