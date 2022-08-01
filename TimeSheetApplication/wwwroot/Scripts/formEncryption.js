//Forgot Password Form Encryption is happening here
$(document).ready(function () {
    $("#login-form").on("submit", function (e) {
        debugger
        e.preventDefault();

        var form = this;
        var key = $("#RSAKey").val();
        var accountno = $(form).find("#login-username").val();
        var RSA = new JSEncrypt();
        RSA.setPublicKey(key);
        var encrypted_accountno = RSA.encrypt(accountno);
        $(form).find("#login-username").val(accountno);
        $(form).find("#login-username").val(encrypted_accountno);
        this.submit();
    });
});
//Secret Question Form Encryption
$(document).ready(function () {
    $("#login-form").on("submit", function (e) {
        debugger
        e.preventDefault();

        var form = this;
        var key = $("#RSAKey").val();
        var secretAns = $(form).find("#secretAnswer").val();
        var accountno = $(form).find("#accountNo").val();
        var RSA = new JSEncrypt();
        RSA.setPublicKey(key);
        var encrypted_accountno = RSA.encrypt(accountno);
        var encrypted_secretAns = RSA.encrypt(secretAns);
        $(form).find("#accountNo").val(encrypted_accountno);
        $(form).find("#secretAnswer").val(encrypted_secretAns);
        this.submit();
    });
});