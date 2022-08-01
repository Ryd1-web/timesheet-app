var key = $("#RSAKey").val();
var RSA = new JSEncrypt();
RSA.setPublicKey(key);

$('#Amount').priceFormat({
    prefix: 'NGN ',
    thousandsSeparator: ',',
    clearOnEmpty: true,
    clearPrefix: true
});


$('#BeneficiaryAmount').priceFormat({
prefix: 'NGN ',
    thousandsSeparator: ',',
clearOnEmpty: true,
clearPrefix: true
});

function valueFormatter(value, row, $element) {

    var format = parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var html = '<div class="price">' + format + '</div>';
    return html;

}

function dateFormatter(value, row, $element) {
    var format = moment(value).format("DD MMMM, YYYY");
    var html = '<div>' + format + '</div>';
    return html;
}


function actionFormatter(value, row, index) {
    return [
        '<a class="approve"  title="Approve">',
        'approve <i class="icon-ok"></i>',
        '</a>  ',
        '<a class="disapprove"  title="Disapprove">',
        'disapprove <i class="icon-remove-sign"></i>',
        '</a>  '
    ].join('');
}


function formatnumber(value) {
    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function unformatnumber(value) {
    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2);
}


jQuery.validator.addMethod("greaterThanZero", function (value, element) {
    return this.optional(element) || (parseFloat(value) > 0);
}, "Amount must be greater than zero");

//jQuery.validator.addMethod("source_and_destination_accounts", function (value, element) {
//    return $('#SourceAccountNo').val() != $('#DestinationAccountNo').val()
//}, "Source and Destination accounts should not be the same");

$('#btnClear').on('click', function (e) {
    clear();
});

function clear() {
    location.reload();
}

$('#btnTransfer').on('click', function (e) {
    debugger;
    var forgeryId = $("#forgeryToken").val();
    var srcAccount = $('#SourceAccountNo').val();
    var destAccount = $('#DestinationAccountNo').val();
    var amount = parseFloat($('#Amount').unmask()) / 100;
    var narration = $('#narration').val();
    var pin = $('#Pin').val();
    var secret = $('#Secret').val();
    var bank = $("#DestinationBank").val();

    var destinationAccountName = $('#DestinationAccountName').val();
    var mameEnquiryRef = $("#NameEnquiryRef").val();
    var beneficiaryBankVerificationNumber = $("#BeneficiaryBankVerificationNumber").val();
    var benefciaryKYCLevel = $("#BenefciaryKYCLevel").val();

    var encrypted_srcAccount = RSA.encrypt(srcAccount);
    var encrypted_destAccount = RSA.encrypt(destAccount);
    var encrypted_narration = RSA.encrypt(narration);
    var encrypted_pin = RSA.encrypt(pin);
    var encrypted_secret = RSA.encrypt(secret);
    var encrypted_bank = RSA.encrypt(bank);

    var encrypted_destAccountName = RSA.encrypt(destinationAccountName);
    var encrypted_mameEnquiryRef = RSA.encrypt(mameEnquiryRef);
    var encrypted_beneficiaryBankVerificationNumber = RSA.encrypt(beneficiaryBankVerificationNumber);
    var encrypted_benefciaryKYCLevel = RSA.encrypt(benefciaryKYCLevel);
    //$("#btnTransfer").attr("disabled", "disabled");
    $("input[type=submit]").attr("disabled", "disabled");

    $('#otherbanktransfer').validate({
        rules: {
            Amount: { greaterThanZero: true },
            //DestinationAccount: { source_and_destination_accounts: true }
        },
        messages: {
            DestinationAccount: { required: "Enter destination account" },
            SourceAccount: "Select source account",
            Amount: { required: "Amount is required" },
            narration: { required: "Narration is required" },
            Pin: "PIN is required",
            Secret: "Secret answer is required"
        },
        errorPlacement: function (error, element) {
            $.notify({
                icon: "notifications",
                message: error.text(),
                title: "INFORMATION",
            }, {
                type: 'danger',
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        },
        submitHandler: function (form) {
            swal({
                title: "Are you sure?",
                text: "Fund transfer will now be processed!",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonColor: "#ff9800",
                confirmButtonText: "Yes, process",
                cancelButtonText: "No, cancel!",
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 6000);
                    });
                }
            }).then(function (isConfirm) {
               
                if (isConfirm) {
                    $("#btnTransfer").attr("disabled", "disabled");
                    $.ajax({
                        url: 'OtherBanksAccount',
                        type: 'POST',
                        data: {
                            SourceAccountNo: encrypted_srcAccount,
                            DestinationAccountNo: encrypted_destAccount,
                            Amount: amount,
                            narration: encrypted_narration, Pin: encrypted_pin, SecretAns: encrypted_secret,
                            DestinationAccountName: encrypted_destAccountName,
                            NameEnquiryRef: encrypted_mameEnquiryRef,
                            BeneficiaryBankVerificationNumber: encrypted_beneficiaryBankVerificationNumber,
                            BenefciaryKYCLevel: encrypted_benefciaryKYCLevel,
                            DestinationBank: encrypted_bank

                        },
                        dataType: "json",
                        headers: {
                            'VerificationToken': forgeryId
                        },
                        success: function (result) {
                            if (result == "0") {
                                swal({ title: 'Fund Transfer', text: 'Transfer process completed successfully!', type: 'success' }).then(function () { clear(); });

                                $("#btnTransfer").removeAttr("disabled");
                                $('#Amount').val('');
                                $('#narration').val('');
                                $('#Pin').val('');
                                $('#Secret').val('');
                                $('#DestinationAccountNo').val('');
                              
                            }
                            else {
                                swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

                                $("#btnTransfer").removeAttr("disabled");
                                $('#Amount').val('');
                                $('#narration').val('');
                                $('#Pin').val('');
                                $('#Secret').val('');
                                $('#DestinationAccountNo').val('');
                            }

                        },
                        error: function (e) {
                            swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

                            $("#btnTransfer").removeAttr("disabled");
                            $('#Amount').val('');
                            $('#narration').val('');
                            $('#Pin').val('');
                            $('#Secret').val('');
                            $('#DestinationAccountNo').val('');

                        }
                    });
                }
            });
        }
 
    },
    function (dismiss) {
        swal('Funds Transfer', 'You cancelled fund transfer processing.', 'error');
        $("#btnTransfer").removeAttr("disabled");
    });
});



$('#btnAddBeneficiary').click(function () {


});



$('#SourceAccountNo').change(function () {
    var acctno = $('#SourceAccountNo').val()
    debugger;
    $.ajax({
        url: "GetAccountBalance",
        dataType: 'json',
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: { accountNo: acctno },
        success: function (data) {
            $("#accountbalance").html('Current Balance: ₦ ' + formatnumber(data));
        },
        error: function () {
            $.notify({
                icon: "notifications",
                message: "Failed to retrieve account balance",
                title: "INFORMATION",
            }, {
                type: 'danger',
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }
    });

});


$('#BeneficiaryAccountNo').change(function () {
   
    var SourceAccountNo = $('#SourceBeneficiaryAccountNo').val();
    var beneficiary = $('#BeneficiaryAccountNo').val();
    debugger
    $.ajax({
        url: 'GetBeneficiaryName',
        dataType: 'json',
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: {
            SourceAccountNo: SourceAccountNo,
            beneficiary: beneficiary
        },
        success: function (data) {
            debugger
            $('#DestinationAccountName').attr("value", data.AccountName);
            $("#_DestinationBeneficiaryAccountName").html(data.AccountName);
            $("#NameEnquiryRef").val(data.SessionID);
            $("#BeneficiaryBankVerificationNumber").val(data.BankVerificationNumber);
            $("#BenefciaryKYCLevel").attr("value", data.KYCLevel);

            $.notify({
                icon: "notifications",
                message: $("#DestinationAccountName").val() + ': ' +
                    $("#BenefciaryKYCLevel").val() + ': ' + $("#BeneficiaryBankVerificationNumber").val()
                    + ': ' + $("#NameEnquiryRef").val(),

                title: "INFORMATION",
            });
        },

        error: function () {
            $.notify({
                icon: "notifications",
                message: "Failed to retieve account name",
                title: "INFORMATION",
            }, {
                type: 'danger',
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }


    });
});


$('#btnBeneficiaryTransfer').on('click', function (e) {
    debugger;
    var forgeryId = $("#forgeryToken").val();
    var srcAccount = $('#SourceBeneficiaryAccountNo').val();
    var destAccount = $('#BeneficiaryAccountNo').val();
    var amount = parseFloat($('#BeneficiaryAmount').unmask()) / 100;
    var narration = $('#Beneficiarynarration').val();
    var pin = $('#BeneficiaryPin').val();
    var secret = $('#BeneficiarySecret').val();
    var destinationAccountName = $('#DestinationAccountName').val();
    var mameEnquiryRef = $("#NameEnquiryRef").val();
    var beneficiaryBankVerificationNumber = $("#BeneficiaryBankVerificationNumber").val();
    var benefciaryKYCLevel = $("#BenefciaryKYCLevel").val();

    var encrypted_srcAccount1 = RSA.encrypt(srcAccount);
    var encrypted_destAccount1 = RSA.encrypt(destAccount);
    var encrypted_narration1 = RSA.encrypt(narration);
    var encrypted_pin1 = RSA.encrypt(pin);
    var encrypted_secret1 = RSA.encrypt(secret);

    var encrypted_destAccountName1 = RSA.encrypt(destinationAccountName);
    var encrypted_mameEnquiryRef1 = RSA.encrypt(mameEnquiryRef);
    var encrypted_beneficiaryBankVerificationNumber1 = RSA.encrypt(beneficiaryBankVerificationNumber);
    var encrypted_benefciaryKYCLevel1 = RSA.encrypt(benefciaryKYCLevel);
    // $("#btnTransfer").attr("disabled", "disabled");
    $("input[type=submit]").attr("disabled", "disabled");

    $('#otherbeneficiarybanktransfer').validate({
        rules: {
            BeneficiaryAmount: { greaterThanZero: true },
            //DestinationAccount: { source_and_destination_accounts: true }
        },
        messages: {
            DestinationAccount: { required: "Enter destination account" },
            SourceAccount: "Select source account",
            BeneficiaryAmount: { required: "Amount is required" },
            Beneficiarynarration: { required: "Narration is required" },
            BeneficiaryPin: "PIN is required",
            BeneficiarySecret: "Secret answer is required"
        },
        errorPlacement: function (error, element) {
            $.notify({
                icon: "notifications",
                message: error.text(),
                title: "INFORMATION",
            }, {
                type: 'danger',
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        },
        submitHandler: function (form) {
            swal({
                title: "Are you sure?",
                text: "Fund transfer will now be processed!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff9800",
                confirmButtonText: "Yes, process",
                cancelButtonText: "No, cancel!",
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 4000);
                    });
                }
            }).then(function (isConfirm) {

                if (isConfirm) {
                    $("#btnBeneficiaryTransfer").attr("disabled", "disabled");
                    $.ajax({
                        url: 'OtherBanksBeneficiaryAccount',
                        type: 'POST',
                        data: {
                            SourceBeneficiaryAccountNo: encrypted_srcAccount1,
                            BeneficiaryAccountNo: encrypted_destAccount1,
                        BeneficiaryAmount: amount,
                        Beneficiarynarration: encrypted_narration1,
                        BeneficiaryPin: encrypted_pin1,
                        BeneficiarySecretAns: encrypted_secret1,
                        DestinationAccountName: encrypted_destAccountName1,
                        NameEnquiryRef: encrypted_mameEnquiryRef1,
                        BeneficiaryBankVerificationNumber: encrypted_beneficiaryBankVerificationNumber1,
                        BenefciaryKYCLevel: encrypted_benefciaryKYCLevel1
                        },
                        dataType: "json",
                        headers: {
                            'VerificationToken': forgeryId
                        },
                        success: function (result) {
                            if (result == "0") {
                                swal({ title: 'Fund Transfer', text: 'Transfer process completed successfully!', type: 'success' }).then(function () { clear(); });

                                $("#btnBeneficiaryTransfer").removeAttr("disabled");
                                $('#BeneficiaryAmount').val('');
                                $('#Beneficiarynarration').val('');
                                $('#BeneficiaryPin').val('');
                                $('#BeneficiarySecret').val('');


                            }
                            else {
                                swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

                                $("#btnBeneficiaryTransfer").removeAttr("disabled");
                                $('#BeneficiaryAmount').val('');
                                $('#Beneficiarynarration').val('');
                                $('#BeneficiaryPin').val('');
                                $('#BeneficiarySecret').val('');
                            }

                        },
                        error: function (e) {
                            swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

                            $("#btnBeneficiaryTransfer").removeAttr("disabled");
                            $('#BeneficiaryAmount').val('');
                            $('#Beneficiarynarration').val('');
                            $('#BeneficiaryPin').val('');
                            $('#BeneficiarySecret').val('');

                        }
                    });
                }
            });
        }

    },
    function (dismiss) {
        swal('Funds Transfer', 'You cancelled fund transfer processing.', 'error');
        $("#btnBeneficiaryTransfer").removeAttr("disabled");
    });
});


$('#DestinationAccountNo').change(function () {
    //var SourceAccountNo = $('#SourceAccountNo').val();
    //var beneficiary = $('#DestinationAccountNo').val();

    var destinationBank = $('#DestinationBank').val();
    var destinationAccountNo = $('#DestinationAccountNo').val();
    debugger
    $.ajax({
        url: 'GetBeneficiary',
        dataType: 'json',
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: {
            //SourceAccountNo: SourceAccountNo,
            //beneficiary: beneficiary
            DestinationAccountNo: destinationAccountNo,
            DestinationBank: destinationBank
        },
        success: function (data) {
            debugger
            $('#DestinationAccountName').attr("value", data.AccountName);
            $("#_DestinationAccountName").html(data.AccountName);
            $("#NameEnquiryRef").val(data.SessionID);
            $("#BeneficiaryBankVerificationNumber").val(data.BankVerificationNumber);
            $("#BenefciaryKYCLevel").attr("value", data.KYCLevel);

            $.notify({
                icon: "notifications",
                message: $("#DestinationAccountName").val() + ': ' +
                    $("#BenefciaryKYCLevel").val() + ': ' + $("#BeneficiaryBankVerificationNumber").val()
                    + ': ' + $("#NameEnquiryRef").val(),

                title: "INFORMATION",
            });
        },

        error: function () {
            $.notify({
                icon: "notifications",
                message: "Failed to retieve account name",
                title: "INFORMATION",
            }, {
                type: 'danger',
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }


    });
});


$('#btnGetBeneficiary').click(function () {
    var destinationBank = $('#DestinationBank').val();
    var  destinationAccountNo = $('#DestinationAccountNo').val();
    $.ajax({
        url: 'GetBeneficiary',
        dataType: 'json',
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: {
            DestinationAccountNo: destinationAccountNo,
            DestinationBank: destinationBank
        },
        success: function (data) {
            debugger
            $('#DestinationAccountName').attr("value", data.AccountName);
            $("#_DestinationAccountName").html(data.AccountName);
            $("#NameEnquiryRef").val(data.SessionID);
            $("#BeneficiaryBankVerificationNumber").val(data.BankVerificationNumber);
            $("#BenefciaryKYCLevel").attr("value", data.KYCLevel);

            $.notify({
                icon: "notifications",
                message: $("#DestinationAccountName").val() + ': ' +
                    $("#BenefciaryKYCLevel").val() + ': ' + $("#BeneficiaryBankVerificationNumber").val()
                    + ': ' + $("#NameEnquiryRef").val(),

                title: "INFORMATION",
            });
        },

        error: function () {
            $.notify({
                icon: "notifications",
                message: "Failed to retieve account name",
                title: "INFORMATION",
            }, {
                type: 'danger',
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }


    });
});