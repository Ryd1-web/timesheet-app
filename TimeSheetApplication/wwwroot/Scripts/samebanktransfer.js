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

$('#TransferTable').on('check.bs.table, click-row.bs.table', function (e, row, $element) {
    $('.info').removeClass('info');
    $($element).addClass('info');
});




jQuery.validator.addMethod("greaterThanZero", function (value, element) {
    return this.optional(element) || (parseFloat(value) > 0);
}, "Amount must be greater than zero");

//jQuery.validator.addMethod("source_and_destination_accounts", function (value, element) {
//    return $('#SourceAccount').val() != $('#DestinationAccount').val()
//}, "Source and Destination accounts should not be the same");

function clear() {
    location.reload();
}


$('#btnClear').on('click', function (e) {

    clear();
});


$('#btnTransfer').on('click', function (e) {
    debugger;
    var forgeryId = $("#forgeryToken").val();
    var srcAccount = $('#SourceAccount').val();
    var destAccount = $('#DestinationAccount').val();
    var amount = parseFloat($('#Amount').unmask()) / 100;
    var narration = $('#narration').val();
    var pin = $('#Pin').val();

    var encrypted_srcAccount1 = RSA.encrypt(srcAccount);
    var encrypted_destAccount1 = RSA.encrypt(destAccount);
    var encrypted_narration1 = RSA.encrypt(narration);
    var encrypted_pin1 = RSA.encrypt(pin);

    $("input[type=submit]").attr("disabled", "disabled");
    $('#samebanktransfer').validate({
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
            //Token: "Token is required"
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
                closeOnConfirm: false,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 5000);
                    });
                }
            }).then(function (isConfirm) {
                if (isConfirm) {
                    $("#btnTransfer").attr("disabled", "disabled");
                    $.ajax({
                        url: 'SameBankAccount',
                        type: 'POST',
                        data: { SourceAccount: encrypted_srcAccount1, DestinationAccount: encrypted_destAccount1, Amount: amount, narration: encrypted_narration1, Pin: encrypted_pin1 },
                        dataType: "json",
                        headers: {
                            'VerificationToken': forgeryId
                        },
                        success: function (result) {
                            if (result == "0") {
                                swal({ title: 'Fund Transfer', text: 'Transfer process completed successfully!', type: 'success' }).then(function () {
                                    clear();
                                });
                                $("#btnTransfer").removeAttr("disabled");

                            }
                            else {
                                swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

                                $("#btnTransfer").removeAttr("disabled");

                            }

                        },
                        error: function (e) {
                            swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

                            $("#btnTransfer").removeAttr("disabled");
                            $('#Pin').val('');
                            $('#Amount').val('');
                            $('#narration').val('');

                            clear();

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

$('#btnBeneficiaryTransfer').on('click', function (e) {
    debugger;
    var forgeryId = $("#forgeryToken").val();
    var srcAccount = $('#BeneficiarySourceAccount').val();
    var destAccount = $('#BeneficiaryDestinationAccount').val();
    var amount = parseFloat($('#BeneficiaryAmount').unmask()) / 100;
    var narration = $('#Beneficiarynarration').val();
    var pin = $('#BeneficiaryPin').val();

    var encrypted_srcAccount = RSA.encrypt(srcAccount);
    var encrypted_destAccount = RSA.encrypt(destAccount);
    var encrypted_narration = RSA.encrypt(narration);
    var encrypted_pin = RSA.encrypt(pin);
    //$("button[type=submit]").removeAttr("disabled",false);
    $('#samebankbeneficiarytransfer').validate({
        rules: {
            BeneficiaryAmount: { greaterThanZero: true },
            //DestinationAccount: { source_and_destination_accounts: true }
        },
        messages: {
            BeneficiaryDestinationAccount: { required: "Enter destination account" },
            BeneficiarySourceAccount: "Select source account",
            BeneficiaryAmount: { required: "Amount is required" },
            Beneficiarynarration: { required: "Narration is required" },
            BeneficiaryPin: "PIN is required",
            //Token: "Token is required"
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
                        }, 6000);
                    });
                }
            }).then(function (isConfirm) {
                if (isConfirm) {
                    $("#btnBeneficiaryTransfer").attr("disabled", "disabled");
                    $.ajax({
                        url: 'SameBankBeneficiaryAccount',
                        type: 'POST',
                        data: { SourceBeneficiaryAccountNo: encrypted_srcAccount, BeneficiaryAccountNo: encrypted_destAccount, BeneficiaryAmount: amount, Beneficiarynarration: encrypted_narration, BeneficiaryPin: encrypted_pin },
                        dataType: "json",
                        headers: {
                            'VerificationToken': forgeryId
                        },
                        success: function (result) {
                            if (result == "0") {
                                swal({ title: 'Fund Transfer', text: 'Transfer process completed successfully!', type: 'success' }).then(function () {
                                    clear();
                                });
                                $("#btnBeneficiaryTransfer").removeAttr("disabled");

                            }
                            else {
                                swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

                                $("#btnBeneficiaryTransfer").removeAttr("disabled");

                            }

                        },
                        error: function (e) {
                            swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

                            $("#btnBeneficiaryTransfer").removeAttr("disabled");
                            $('#BeneficiaryPin').val('');
                            $('#BeneficiaryAmount').val('');
                            $('#Beneficiarynarration').val('');

                            clear();

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
$('#btnGetAccountDetails').click(function () {
    var acctno = $('#DestinationAccount').val()
    debugger;
    $.ajax({
        url: "GetAccountDetails",
        dataType: 'json',
        type: 'GET',
        cache: false,
        dataType: 'json',
        data: { acctno: acctno },
        success: function (data) {
            $("#accountdetails").html(data.CustomerName);
        },

        error: function () {
            $.notify({
                icon: "notifications",
                message: "Failed to retrieve account name",
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
    var destinationAccountNo = $('#DestinationAccountNo').val();
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

$('#DestinationAccount').change(function () {
    var acctno = $('#DestinationAccount').val()
    debugger;
    $.ajax({
        url: "GetAccountDetails",
        dataType: 'json',
        type: 'GET',
        cache: false,
        dataType: 'json',
        data: { acctno: acctno },
        success: function (data) {
            $("#accountdetails").html(data.CustomerName);
            $('#DestinationAccount').val(acctno);
        },

        error: function () {
            $.notify({
                icon: "notifications",
                message: "Failed to retrieve account name",
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


$('#SourceAccount').change(function () {
    var acctno = $('#SourceAccount').val()


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
$('#BeneficiarySourceAccount').change(function () {
    var acctno = $('#BeneficiarySourceAccount').val()


    debugger;
    $.ajax({
        url: "GetAccountBalance",
        dataType: 'json',
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: { accountNo: acctno },
        success: function (data) {
            $("#sourceaccountbalance").html('Current Balance: ₦ ' + formatnumber(data));

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


$('#BeneficiaryDestinationAccount').change(function () {
    var acctno = $('#BeneficiaryDestinationAccount').val()
    debugger;
    $.ajax({
        url: "GetAccountDetails",
        dataType: 'json',
        type: 'GET',
        cache: false,
        dataType: 'json',
        data: { acctno: acctno },
        success: function (data) {
            $("#saccountdetails").html(data.CustomerName);
            $('#BeneficiaryDestinationAccount').val(acctno);
        },

        error: function () {
            $.notify({
                icon: "notifications",
                message: "Failed to retrieve account name",
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



//$('#Amount').priceFormat({
//    prefix: 'NGN ',
//    thousandsSeparator: ',',
//    clearOnEmpty: true,
//    clearPrefix: true
//});
//$('#BeneficiaryAmount').priceFormat({
//    prefix: 'NGN ',
//    thousandsSeparator: ',',
//    clearOnEmpty: true,
//    clearPrefix: true
//});
//function valueFormatter(value, row, $element) {
//    var format = parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//    var html = '<div class="price">' + format + '</div>';
//    return html;
//}

//function dateFormatter(value, row, $element) {
//    var format = moment(value).format("DD MMMM, YYYY");
//    var html = '<div>' + format + '</div>';
//    return html;
//}

//function actionFormatter(value, row, index) {
//    return [
//        '<a class="approve"  title="Approve">',
//        'approve <i class="icon-ok"></i>',
//        '</a>  ',
//        '<a class="disapprove"  title="Disapprove">',
//        'disapprove <i class="icon-remove-sign"></i>',
//        '</a>  '
//    ].join('');
//}

//function formatnumber(value) {
//    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//}
//function unformatnumber(value) {
//    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2);
//}

//$('#TransferTable').on('check.bs.table, click-row.bs.table', function (e, row, $element) {
//    $('.info').removeClass('info');
//    $($element).addClass('info');
//});




//jQuery.validator.addMethod("greaterThanZero", function (value, element) {
//    return this.optional(element) || (parseFloat(value) > 0);
//}, "Amount must be greater than zero");

////jQuery.validator.addMethod("source_and_destination_accounts", function (value, element) {
////    return $('#SourceAccount').val() != $('#DestinationAccount').val()
////}, "Source and Destination accounts should not be the same");

//function clear() {
//    location.reload();
//}


//$('#btnClear').on('click', function (e) {

//    clear();
//});


//$('#btnTransfer').on('click', function (e) {
//    debugger;
//    var forgeryId = $("#forgeryToken").val();
//    var srcAccount = $('#SourceAccount').val();
//    var destAccount = $('#DestinationAccount').val();
//    var amount = parseFloat($('#Amount').unmask()) / 100;
//    var narration = $('#narration').val();
//    var pin = $('#Pin').val();

//    $("input[type=submit]").attr("disabled", "disabled");
//    $('#samebanktransfer').validate({
//        rules: {
//            Amount: { greaterThanZero: true },
//            //DestinationAccount: { source_and_destination_accounts: true }
//        },
//        messages: {
//            DestinationAccount: { required: "Enter destination account" },
//            SourceAccount: "Select source account",
//            Amount: { required: "Amount is required" },
//            narration: { required: "Narration is required" },
//            Pin: "PIN is required",
//            //Token: "Token is required"
//        },
//        errorPlacement: function (error, element) {
//            $.notify({
//                icon: "notifications",
//                message: error.text(),
//                title: "INFORMATION",
//            }, {
//                type: 'danger',
//                placement: {
//                    from: 'top',
//                    align: 'right'
//                }
//            });
//        },
//        submitHandler: function (form) {
//            swal({
//                title: "Are you sure?",
//                text: "Fund transfer will now be processed!",
//                type: "warning",
//                showCancelButton: true,
//                confirmButtonColor: "#ff9800",
//                confirmButtonText: "Yes, process",
//                cancelButtonText: "No, cancel!",
//                showLoaderOnConfirm: true,
//                preConfirm: function () {
//                    return new Promise(function (resolve) {
//                        setTimeout(function () {
//                            resolve();
//                        }, 6000);
//                    });
//                }
//            }).then(function (isConfirm) {
//                if (isConfirm) {
//                    $("#btnTransfer").attr("disabled", "disabled");
//                    $.ajax({
//                        url: 'SameBankAccount',
//                        type: 'POST',
//                        data: { SourceAccount: srcAccount, DestinationAccount: destAccount, Amount: amount, narration: narration, Pin: pin },
//                        dataType: "json",
//                        headers: {
//                            'VerificationToken': forgeryId
//                        },
//                        success: function (result) {
//                            if (result == "0") {
//                                swal({ title: 'Fund Transfer', text: 'Transfer process completed successfully!', type: 'success' }).then(function () {
//                                    clear();
//                                });
//                                $("#btnTransfer").removeAttr("disabled");

//                            }
//                            else {
//                                swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

//                                $("#btnTransfer").removeAttr("disabled");

//                            }

//                        },
//                        error: function (e) {
//                            swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

//                            $("#btnTransfer").removeAttr("disabled");
//                            $('#Pin').val('');
//                            $('#Amount').val('');
//                            $('#narration').val('');

//                            clear();

//                        }
//                    });
//                }
//            });
//        }
//    },
//        function (dismiss) {

//            swal('Funds Transfer', 'You cancelled fund transfer processing.', 'error');
//            $("#btnTransfer").removeAttr("disabled");

//        });
//});

//$('#btnBeneficiaryTransfer').on('click', function (e) {
//    debugger;
//    var forgeryId = $("#forgeryToken").val();
//    var srcAccount = $('#BeneficiarySourceAccount').val();
//    var destAccount = $('#BeneficiaryDestinationAccount').val();
//    var amount = parseFloat($('#BeneficiaryAmount').unmask()) / 100;
//    var narration = $('#Beneficiarynarration').val();
//    var pin = $('#BeneficiaryPin').val();

//    //$("button[type=submit]").removeAttr("disabled",false);
//    $('#samebankbeneficiarytransfer').validate({
//        rules: {
//            BeneficiaryAmount: { greaterThanZero: true },
//            //DestinationAccount: { source_and_destination_accounts: true }
//        },
//        messages: {
//            BeneficiaryDestinationAccount: { required: "Enter destination account" },
//            BeneficiarySourceAccount: "Select source account",
//            BeneficiaryAmount: { required: "Amount is required" },
//            Beneficiarynarration: { required: "Narration is required" },
//            BeneficiaryPin: "PIN is required",
//            //Token: "Token is required"
//        },
//        errorPlacement: function (error, element) {
//            $.notify({
//                icon: "notifications",
//                message: error.text(),
//                title: "INFORMATION",
//            }, {
//                type: 'danger',
//                placement: {
//                    from: 'top',
//                    align: 'right'
//                }
//            });
//        },
//        submitHandler: function (form) {
//            swal({
//                title: "Are you sure?",
//                text: "Fund transfer will now be processed!",
//                type: "warning",
//                showCancelButton: true,
//                confirmButtonColor: "#ff9800",
//                confirmButtonText: "Yes, process",
//                cancelButtonText: "No, cancel!",
//                showLoaderOnConfirm: true,
//                preConfirm: function () {
//                    return new Promise(function (resolve) {
//                        setTimeout(function () {
//                            resolve();
//                        }, 6000);
//                    });
//                }
//            }).then(function (isConfirm) {
//                if (isConfirm) {
//                    $("#btnBeneficiaryTransfer").attr("disabled", "disabled");
//                    $.ajax({
//                        url: 'SameBankBeneficiaryAccount',
//                        type: 'POST',
//                        data: { SourceBeneficiaryAccountNo: srcAccount, BeneficiaryDestinationAccount: destAccount, BeneficiaryAmount: amount, Beneficiarynarration: narration, BeneficiaryPin: pin },
//                        dataType: "json",
//                        headers: {
//                            'VerificationToken': forgeryId
//                        },
//                        success: function (result) {
//                            if (result == "0") {
//                                swal({ title: 'Fund Transfer', text: 'Transfer process completed successfully!', type: 'success' }).then(function () {
//                                    clear();
//                                });
//                                $("#btnBeneficiaryTransfer").removeAttr("disabled");

//                            }
//                            else {
//                                swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

//                                $("#btnBeneficiaryTransfer").removeAttr("disabled");

//                            }

//                        },
//                        error: function (e) {
//                            swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

//                            $("#btnBeneficiaryTransfer").removeAttr("disabled");
//                            $('#BeneficiaryPin').val('');
//                            $('#BeneficiaryAmount').val('');
//                            $('#Beneficiarynarration').val('');

//                            clear();

//                        }
//                    });
//                }
//            });
//        }
//    },
//        function (dismiss) {

//            swal('Funds Transfer', 'You cancelled fund transfer processing.', 'error');
//            $("#btnBeneficiaryTransfer").removeAttr("disabled");

//        });
//});
//$('#btnGetAccountDetails').click(function () {
//    var acctno = $('#DestinationAccount').val()
//    debugger;
//    $.ajax({
//        url: "GetAccountDetails",
//        dataType: 'json',
//        type: 'GET',
//        cache: false,
//        dataType: 'json',
//        data: { acctno: acctno },
//        success: function (data) {
//            $("#accountdetails").html(data.CustomerName);
//        },

//        error: function () {
//            $.notify({
//                icon: "notifications",
//                message: "Failed to retrieve account name",
//                title: "INFORMATION",
//            }, {
//                type: 'danger',
//                placement: {
//                    from: 'top',
//                    align: 'right'
//                }
//            });
//        }
//    });

//});

//$('#DestinationAccount').change(function () {
//    var acctno = $('#DestinationAccount').val()
//    debugger;
//    $.ajax({
//        url: "GetAccountDetails",
//        dataType: 'json',
//        type: 'GET',
//        cache: false,
//        dataType: 'json',
//        data: { acctno: acctno },
//        success: function (data) {
//            $("#accountdetails").html(data.CustomerName);
//            $('#DestinationAccount').val(acctno);
//        },

//        error: function () {
//            $.notify({
//                icon: "notifications",
//                message: "Failed to retrieve account name",
//                title: "INFORMATION",
//            }, {
//                type: 'danger',
//                placement: {
//                    from: 'top',
//                    align: 'right'
//                }
//            });
//        }
//    });

//});

//$('#SourceAccount').change(function () {
//    var acctno = $('#SourceAccount').val()


//    debugger;
//    $.ajax({
//        url: "GetAccountBalance",
//        dataType: 'json',
//        type: 'POST',
//        cache: false,
//        dataType: 'json',
//        data: { accountNo: acctno },
//        success: function (data) {
//            $("#accountbalance").html('Current Balance: ₦ ' + formatnumber(data));

//        },

//        error: function () {
//            $.notify({
//                icon: "notifications",
//                message: "Failed to retrieve account balance",
//                title: "INFORMATION",
//            }, {
//                type: 'danger',
//                placement: {
//                    from: 'top',
//                    align: 'right'
//                }
//            });
//        }
//    });

//});


////$('#Amount').priceFormat({
////    prefix: 'NGN ',
////    thousandsSeparator: ',',
////    clearOnEmpty: true,
////    clearPrefix: true
////});

////function valueFormatter(value, row, $element) {
////    var format = parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
////    var html = '<div class="price">' + format + '</div>';
////    return html;
////}

////function dateFormatter(value, row, $element) {
////    var format = moment(value).format("DD MMMM, YYYY");
////    var html = '<div>' + format + '</div>';
////    return html;
////}

////function actionFormatter(value, row, index) {
////    return [
////        '<a class="approve"  title="Approve">',
////        'approve <i class="icon-ok"></i>',
////        '</a>  ',
////        '<a class="disapprove"  title="Disapprove">',
////        'disapprove <i class="icon-remove-sign"></i>',
////        '</a>  '
////    ].join('');
////}

////function formatnumber(value) {
////    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
////}
////function unformatnumber(value) {
////    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2);
////}

////$('#TransferTable').on('check.bs.table, click-row.bs.table', function (e, row, $element) {
////    $('.info').removeClass('info');
////    $($element).addClass('info');
////});




////jQuery.validator.addMethod("greaterThanZero", function (value, element) {
////    return this.optional(element) || (parseFloat(value) > 0);
////}, "Amount must be greater than zero");

//////jQuery.validator.addMethod("source_and_destination_accounts", function (value, element) {
//////    return $('#SourceAccount').val() != $('#DestinationAccount').val()
//////}, "Source and Destination accounts should not be the same");

////function clear()
////{
////    location.reload();
////}


////$('#btnClear').on('click', function (e) {
  
////    clear();
////});


////$('#btnTransfer').on('click', function (e) {
////    debugger;
////    var forgeryId = $("#forgeryToken").val();
////    var srcAccount = $('#SourceAccount').val();
////    var destAccount = $('#DestinationAccount').val();
////    var amount = parseFloat($('#Amount').unmask()) / 100;
////    var narration = $('#narration').val();
////    var pin = $('#Pin').val();

////    $("input[type=submit]").attr("disabled", "disabled");
////    $('#samebanktransfer').validate({
////        rules: {
////            Amount: { greaterThanZero: true },
////            //DestinationAccount: { source_and_destination_accounts: true }
////        },
////        messages: {
////            DestinationAccount: { required: "Enter destination account" },
////            SourceAccount: "Select source account",
////            Amount: { required: "Amount is required" },
////            narration: { required: "Narration is required" },
////            Pin: "PIN is required",
////            //Token: "Token is required"
////        },
////        errorPlacement: function (error, element) {
////            $.notify({
////                icon: "notifications",
////                message: error.text(),
////                title: "INFORMATION",
////            }, {
////                type: 'danger',
////                placement: {
////                    from: 'top',
////                    align: 'right'
////                }
////            });
////        },
////        submitHandler: function (form) {
////            swal({
////                title: "Are you sure?",
////                text: "Fund transfer will now be processed!",
////                type: "warning",
////                showCancelButton: true,
////                confirmButtonColor: "#ff9800",
////                confirmButtonText: "Yes, process",
////                cancelButtonText: "No, cancel!",
////                showLoaderOnConfirm: true,
////                preConfirm: function () {
////                    return new Promise(function (resolve) {
////                        setTimeout(function () {
////                            resolve();
////                        }, 6000);
////                    });
////                }
////            }).then(function (isConfirm) {
////                if (isConfirm) {
////                    $("#btnTransfer").attr("disabled", "disabled");
////                    $.ajax({
////                        url: 'SameBankAccount',
////                        type: 'POST',
////                        data: { SourceAccount: srcAccount, DestinationAccount: destAccount, Amount: amount, narration: narration, Pin: pin },
////                        dataType: "json",
////                        headers: {
////                            'VerificationToken': forgeryId
////                        },
////                        success: function (result) {
////                            if (result == "0") {
////                                swal({ title: 'Fund Transfer', text: 'Transfer process completed successfully!', type: 'success' }).then(function () {
////                                    clear();
////                                });
////                                $("#btnTransfer").removeAttr("disabled");
                               
////                            }
////                            else {
////                                swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

////                                $("#btnTransfer").removeAttr("disabled");
                             
////                            }

////                        },
////                        error: function (e) {
////                            swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

////                            $("#btnTransfer").removeAttr("disabled");
////                            $('#Pin').val('');
////                            $('#Amount').val('');
////                            $('#narration').val('');

////                            clear();

////                        }
////                    });
////                }
////            });
////        }
////    },
////        function (dismiss) {

////            swal('Funds Transfer', 'You cancelled fund transfer processing.', 'error');
////            $("#btnTransfer").removeAttr("disabled");

////        });
////});


////$('#samebankbeneficiarytransfer').validate({
////    rules: {
////        BeneficiaryAmount: { greaterThanZero: true },
////        //DestinationAccount: { source_and_destination_accounts: true }
////    },
////    messages: {
////        BeneficiaryDestinationAccount: { required: "Enter destination account" },
////        BeneficiarySourceAccount: "Select source account",
////        BeneficiaryAmount: { required: "Amount is required" },
////        Beneficiarynarration: { required: "Narration is required" },
////        BeneficiaryPin: "PIN is required",
////        //Token: "Token is required"
////    },
////    errorPlacement: function (error, element) {
////        $.notify({
////            icon: "notifications",
////            message: error.text(),
////            title: "INFORMATION",
////        }, {
////            type: 'danger',
////            placement: {
////                from: 'top',
////                align: 'right'
////            }
////        });
////    },
////    submitHandler: function (form) {
////        swal({
////            title: "Are you sure?",
////            text: "Fund transfer will now be processed!",
////            type: "warning",
////            showCancelButton: true,
////            confirmButtonColor: "#ff9800",
////            confirmButtonText: "Yes, process",
////            cancelButtonText: "No, cancel!",
////            showLoaderOnConfirm: true,
////            preConfirm: function () {
////                return new Promise(function (resolve) {
////                    setTimeout(function () {
////                        resolve();
////                    }, 6000);
////                });
////            }
////        }).then(function (isConfirm) {
////            if (isConfirm) {
////                $("#btnBeneficiaryTransfer").attr("disabled", "disabled");
////                $.ajax({
////                    url: 'SameBankBeneficiaryAccount',
////                    type: 'POST',
////                    data: { SourceBeneficiaryAccountNo: srcAccount, BeneficiaryAccountNo: destAccount, BeneficiaryAmount: amount, Beneficiarynarration: narration, BeneficiaryPin: pin },
////                    dataType: "json",
////                    headers: {
////                        'VerificationToken': forgeryId
////                    },
////                    success: function (result) {
////                        if (result == "0") {
////                            swal({ title: 'Fund Transfer', text: 'Transfer process completed successfully!', type: 'success' }).then(function () {
////                                clear();
////                            });
////                            $("#btnBeneficiaryTransfer").removeAttr("disabled");

////                        }
////                        else {
////                            swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

////                            $("#btnBeneficiaryTransfer").removeAttr("disabled");

////                        }

////                    },
////                    error: function (e) {
////                        swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

////                        $("#btnBeneficiaryTransfer").removeAttr("disabled");
////                        $('#BeneficiaryPin').val('');
////                        $('#BeneficiaryAmount').val('');
////                        $('#Beneficiarynarration').val('');

////                        clear();

////                    }
////                });
////            }
////        });
////    }
////},
////       function (dismiss) {

////           swal('Funds Transfer', 'You cancelled fund transfer processing.', 'error');
////           $("#btnBeneficiaryTransfer").removeAttr("disabled");

////       });
////});


////$('#btnGetAccountDetails').click(function () {
////    var acctno = $('#DestinationAccount').val()
////    debugger;
////    $.ajax({
////        url: "GetAccountDetails",
////        dataType: 'json',
////        type: 'GET',
////        cache: false,
////        dataType: 'json',
////        data: { acctno: acctno },
////        success: function (data) {
////            $("#accountdetails").html(data.CustomerName);
////        },

////        error: function () {
////            $.notify({
////                icon: "notifications",
////                message: "Failed to retrieve account name",
////                title: "INFORMATION",
////            }, {
////                type: 'danger',
////                placement: {
////                    from: 'top',
////                    align: 'right'
////                }
////            });
////        }
////    });

////});

////$('#DestinationAccount').change(function () {
////    var acctno = $('#DestinationAccount').val()
////    debugger;
////    $.ajax({
////        url: "GetAccountDetails",
////        dataType: 'json',
////        type: 'GET',
////        cache: false,
////        dataType: 'json',
////        data: { acctno: acctno },
////        success: function (data) {
////            $("#accountdetails").html(data.CustomerName);
////            $('#DestinationAccount').val(acctno);
////        },

////        error: function () {
////            $.notify({
////                icon: "notifications",
////                message: "Failed to retrieve account name",
////                title: "INFORMATION",
////            }, {
////                type: 'danger',
////                placement: {
////                    from: 'top',
////                    align: 'right'
////                }
////            });
////        }
////    });

////});

////$('#SourceAccount').change(function () {
////    var acctno = $('#SourceAccount').val()


////    debugger;
////    $.ajax({
////        url: "GetAccountBalance",
////        dataType: 'json',
////        type: 'POST',
////        cache: false,
////        dataType: 'json',
////        data: { accountNo: acctno },
////        success: function (data) {
////            $("#accountbalance").html('Current Balance: ₦ ' + formatnumber(data));
           
////        },

////        error: function () {
////            $.notify({
////                icon: "notifications",
////                message: "Failed to retrieve account balance",
////                title: "INFORMATION",
////            }, {
////                type: 'danger',
////                placement: {
////                    from: 'top',
////                    align: 'right'
////                }
////            });
////        }
////    });

////});

//$('#BeneficiarySourceAccount').change(function () {
//    var acctno = $('#BeneficiarySourceAccount').val()


//    debugger;
//    $.ajax({
//        url: "GetAccountBalance",
//        dataType: 'json',
//        type: 'POST',
//        cache: false,
//        dataType: 'json',
//        data: { accountNo: acctno },
//        success: function (data) {
//            $("#sourceaccountbalance").html('Current Balance: ₦ ' + formatnumber(data));

//        },

//        error: function () {
//            $.notify({
//                icon: "notifications",
//                message: "Failed to retrieve account balance",
//                title: "INFORMATION",
//            }, {
//                type: 'danger',
//                placement: {
//                    from: 'top',
//                    align: 'right'
//                }
//            });
//        }
//    });

//});


//$('#BeneficiaryDestinationAccount').change(function () {
//    debugger
//    var acctno = $('#BeneficiaryDestinationAccount').val()
//    debugger;
//    $.ajax({
//        url: "GetAccountDetails",
//        dataType: 'json',
//        type: 'GET',
//        cache: false,
//        dataType: 'json',
//        data: { acctno: acctno },
//        success: function (data) {
//            $("#saccountdetails").html(data.CustomerName);
//            $('#BeneficiaryDestinationAccount').val(acctno);
//        },

//        error: function () {
//            $.notify({
//                icon: "notifications",
//                message: "Failed to retrieve account name",
//                title: "INFORMATION",
//            }, {
//                type: 'danger',
//                placement: {
//                    from: 'top',
//                    align: 'right'
//                }
//            });
//        }
//    });

//});