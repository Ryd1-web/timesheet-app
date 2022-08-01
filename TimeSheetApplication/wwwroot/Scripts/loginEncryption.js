//function encryptForm() {
//    $(document).ready(function () {
//        debugger;
//        var username = $("#login-username").val();
//        var password = $("#password").val();
//        //$("input[type=submit]").attr("disabled","disabled");
//        var pass = CryptoJS.MD5(password);
//        debugger;
//        $.ajax({
//            type: "POST",
//            url: "../Account/Login",
//            data: { AccountNumber: username, Password: pass },
//            success: function () {
//                console.log("Redirected....");
//            }
//        })
//    })
//}
function getNumber() {
    var minNumber = 1; // le minimum
    var maxNumber = 100; // le maximum
    var randomnumber = Math.floor(Math.random() * (maxNumber + 1) + minNumber); // la fonction magique
    
    return randomnumber;
}
$(document).ready(function () {
    setTimeout(function () {
        $(".alert").fadeTo(500, 0).slideUp(500,
            function () {
                $(this).remove();
                $("#login-username2").val("");
                window.location.reload(true);
            });

    }, 5000);
   
})
$(document).ready(function () {
    $("#login-form").on("submit", function (e) {
        debugger
        e.preventDefault();

        var form = this;

        var key = $("#RSAKey").val();
        var accountno = $(form).find("#login-username2").val();
        var pass = $(form).find("#password2").val();

        var RSA = new JSEncrypt();
        RSA.setPublicKey(key);
        var encrypted_accountno = RSA.encrypt(accountno);
        var encrypted_pass = RSA.encrypt(pass);
        $(form).find("#login-username").val(encrypted_accountno);
        $(form).find("#password").val(encrypted_pass);
        $(form).find("#login-username2").val(accountno);
        $(form).find("#password2").val("Password");
        this.submit();
    });
});