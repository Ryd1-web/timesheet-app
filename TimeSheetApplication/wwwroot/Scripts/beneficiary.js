
function deleteFormatter(value, row, index) {
    return [
        '<a class="delete" title="Edit Pencil">',
    '<i class="material-icons">trending_up</i>',
    '</a>  '
].join('');
}

window.deleteEvents = {
    'click .delete': function (e, value, row, index) {
        alert('You click like action, row: ' + JSON.stringify(row));
    }
};







$('#btnGetAccountDetails').click(function () {
    var acctno = $('#BeneficiaryAccount').val()
    debugger;
    $.ajax({
        url: "GetAccountDetails",
        dataType: 'json',
        type: 'GET',
        cache: false,
        data: { acctno: acctno },
        success: function (data) {
            $("#BeneficiaryAccountName").html(data.CustomerName);
            $.notify({
                icon: "notifications",
                message: "account name retrieved successfully.",
                title: "INFORMATION",
            }, {
                type: 'success',
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
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

$('#BeneficiaryAccount').change(function () {
    var acctno = $('#BeneficiaryAccount').val()

    debugger;
    $.ajax({
        url: "GetAccountDetails",
        dataType: 'json',
        type: 'GET',
        cache: false,
        data: { acctno: acctno },
        success: function (data) {
            $("#BeneficiaryAccountName").html(data.CustomerName);

            if ( data.CustomerName != null) {
                $.notify({
                    icon: "notifications",
                    message: data.CustomerName + "<br/> Account name retrieved successfully.",
                    title: "INFORMATION",
                }, {
                    type: 'success',
                    placement: {
                        from: 'top',
                        align: 'right'
                    }
                });
            }
            else {
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



//$('btnGetInterbankAccdetails').click(function () {
//    var acctno = $('#BenAccNo').val() 
//    var benbank = $('#BenBank').val()
//    debugger;
//    $.ajax({
//        url: " NameEnquiryOperationFTDC",
//        dataType: 'json',
//        type: 'GET',
//        cache: false,
//        dataType: 'json',
//        data: { BenAccNo: BenAccNo, BenBank: BenBank },
//        success: function (data) {
//            $("#OtherBeneficiaryAccountName").html(data.CustomerName);
//            $.notify({
//                icon: "notifications",
//                message: "account name retrieved successfully.",
//                title: "INFORMATION",
//            }, {
//                    type: 'success',
//                    placement: {
//                        from: 'top',
//                        align: 'right'
//                    }
//                });
//        },

//        error: function () {
//            $.notify({
//                icon: "notifications",
//                message: "Failed to Retieve Beneficiary Account Details from NIBSS",
//                title: "INFORMATION",
//            }, {
//                    type: 'danger',
//                    placement: {
//                        from: 'top',
//                        align: 'right'
//                    }
//                });
//        }
//    });

//});
