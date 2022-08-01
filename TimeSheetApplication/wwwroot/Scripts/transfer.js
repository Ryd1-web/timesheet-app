var key = $("#RSAKey").val();
var RSA = new JSEncrypt();
RSA.setPublicKey(key);

$('#Amount').priceFormat({
    prefix: 'NGN ',
    thousandsSeparator: ',',
    clearOnEmpty: true,
    clearPrefix: true
});

function printFormatter(value, row, index) {
    debugger;

    var data = JSON.stringify(row);

    //alert(data);

    return [
        '<a class="print" target="_blank" href="../Transfer/transferReceipt?transRef=' + row.TransactionRef + '" title="print receipt">',
        '<i class="fa fa-print"></i> Print',
        '</a>  '
    ].join('');
}

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
//    return $('#SourceAccount').val() != $('#DestinationAccount').val()
//}, "Source and Destination accounts should not be the same");


$('#btnClear').on('click', function (e) {
    location.reload();
    clear();
});

$('#btnTransfer').on('click', function (e) {
    debugger;
    var forgeryId = $("#forgeryToken").val();
    var srcAccount = $('#SourceAccount').val();
    var destAccount = $('#DestinationAccount').val();
    var amount = parseFloat($('#Amount').unmask()) / 100;
    var narration = $('#narration').val();

    var encrypted_srcAccount = RSA.encrypt(srcAccount);
    var encrypted_destAccount = RSA.encrypt(destAccount);
    var encrypted_narration = RSA.encrypt(narration);
    //var pin = $('#Pin').val();

    $("input[type=submit]").attr("disabled", "disabled");
    $('#owntransfer').validate({
        rules: {
            Amount: { greaterThanZero: true },
            //DestinationAccount: { source_and_destination_accounts: true }
        },
        messages: {
            DestinationAccount: { required: "Select destination account" },
            SourceAccount: "Select source account",
            Amount: { required: "Amount is required" },
            narration: { required: "Narration is required" },
            //Pin:"PIN is required"
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
                buttonsStyling: false,
                focusConfirm: false,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve();
                        }, 4000);
                    });
                }
            }).then(function (isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        url: 'OwnAccountTransfer',
                        type: 'POST',
                        data: { SourceAccount: encrypted_srcAccount, DestinationAccount: encrypted_destAccount, Amount: amount, narration: encrypted_narration },
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

                            }
                            else {
                                swal({ title: 'Fund Transfer', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { clear(); });

                                $("#btnTransfer").removeAttr("disabled");
                                $('#Amount').val('');
                                $('#narration').val('');
                            }

                        },
                        error: function (e) {
                            swal({ title: 'Fund Transfer', text: 'Transfer process encountered an error: </br> incomplete or invalid entry.' + e.responseText.toString(), type: 'error' }).then(function () { clear(); });

                            $("#btnTransfer").removeAttr("disabled");
                            $('#Amount').val('');
                            $('#narration').val('');                     

                        }
                    });
                }
            });
        }
    },
    function (dismiss) {
        swal('Funds Transfer', 'You cancelled fund transfer processing.', 'error');

    });
});

