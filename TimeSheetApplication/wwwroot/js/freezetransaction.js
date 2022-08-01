function freezeTransactionOperationFormatter(value, row, index) {
    return [
        '<a class="edit btn btn-sm btn-warning d-none d-sm-inline mr-2"  title="Edit Freeze Transaction">',
        '<i class="now-ui-icons ui-2_settings-90"></i> ',
        '</a>',
        '<a class="remove btn btn-sm btn-danger"  title="Delete Freeze Transaction">',
        '<i class="now-ui-icons ui-1_simple-remove"></i> ',
        '</a>'
    ].join('');
}
window.freezeTransactionOperationEvents = {
    'click .edit': function (e, value, row, index) {
        debugger
        if (row.state = true) {
            var data = JSON.stringify(row);
            $("#rowId").val(row.id)
            $('#FreezeTransaction2').val(row.freezeTransaction);
            $('#Code').val(row.code);
            $('#Description').val(row.description);
            $('#FreezeTransactionModal2').modal('show');
            $('#btnFreezeTransactionUpdate').html('<i class="now-ui-icons ui-1_check"></i> Update Record');
            $('#btnSaveFreezeTransaction').hide();
            $('#btnFreezeTransactionUpdate').show();
            $('#titleBS1').hide();
            $('#titleBS2').show();
        }
    },
    'click .remove': function (e, value, row, index) {
        debugger
        info = JSON.stringify(row);
        console.log(info);
        debugger;
        $.ajax({
            url: '../FreezeSetup/RemoveFreezeTransaction',
            Transaction: 'POST',
            data: { Id: row.id },
            success: function (data) {
                swal({
                    title: "Are you sure?",
                    text: "You are about to delete this record!",
                    Transaction: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ff9800",
                    confirmButtonText: "Yes, proceed",
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



                        swal("Deleted succesfully");
                        //alert('Deleted succesfully');
                        $('#listfreezeTransactionTable').
                            bootstrapTable(
                                'refresh', { url: '../FreezeSetup/listfreezetransaction' });

                        //return false;
                    }
                    else {
                        swal("Freeze Transaction", "You cancelled delete freeze transaction.", "error");
                    }
                    $('#listfreezeTable').
                        bootstrapTable(
                            'refresh', { url: '../FreezeSetup/listfreezetransaction' });
                });
                return

            },

            error: function (e) {
                //alert("An exception occured!");
                swal("An exception occured!");
            }
        });
    }
};
$(document).ready(function ($) {
    $('#btnSaveFreezeTransaction').hide();
    $('#btnFreezeTransactionUpdate').show();
    $('#titleBS2').hide();
    $('#titleBS1').show();
    $('#btnFreezeTransactionUpdate').on('click', function () {
        var freezeTransaction2 = $('#FreezeTransaction2').val();
        var Id = $('#rowId').val();
        var code = $('#Code').val();
        var description = $('#Description').val();
        // $("button[Transaction=submit]").attr("disabled", "disabled");

        $.ajax({
            url: '../FreezeSetup/UpdateFreezeTransactionOperation',
            type: 'POST',
            data: { FreezeTransaction2: freezeTransaction2, Code: code, Description: description, rowId: Id },
            dataTransaction: "json",
            //headers: {
            //    'VerificationToken': forgeryId
            //},
            success: function (result) {
                alert(result);
                if (result.toString !== '' && result !== null) {
                    swal({ title: 'Freeze Transaction', text: 'Freeze Transaction updated successfully!', Transaction: 'success' }).then(function () { clear(); });

                    $('#listfreezeTable').
                        bootstrapTable(
                            'refresh', { url: 'FreezeSetup/listfreezetransaction' });

                    $("#btnFreezeTransactionUpdate").removeAttr("disabled");
                }
                else {
                    swal({ title: 'Freeze Transaction', text: 'Something went wrong: </br>' + result.toString(), Transaction: 'error' }).then(function () { clear(); });
                    $("#btnFreezeTransactionUpdate").removeAttr("disabled");
                }
            },
            error: function (e) {
                swal({ title: 'Freeze Transaction', text: 'Freeze Date Type encountered an error', Transaction: 'error' }).then(function () { clear(); });
                $("#btnFreezeTransactionUpdate").removeAttr("disabled");
            }
        });
    });

});
$(document).ready(function () {
    $('#btnSaveFreezeTransaction').show();
    $('#btnFreezeTransactionUpdate').hide();
    $('#titleBS1').show();
    $('#titleBS2').hide();
    $("#btnSaveFreezeTransaction").click(function () {
        var freezeTransaction = $('#FreezeTransaction2').val();
        var code = $('#Code').val();
        var description = $('#Description').val();
        $.ajax({
            url: '../FreezeSetup/CreateFreezeTransactionOperation',
            type: 'POST',
            data: { FreezeTransaction2: freezeTransaction, Code: code, Description: description },
            dataType: "json",
            //headers: {
            //    'VerificationToken': forgeryId
            //},
            success: function (result) {
                alert(result);
                if (result.toString !== '' && result !== null) {
                    swal({ title: 'Freeze Transaction', text: 'Freeze Transaction added successfully!', Transaction: 'success' }).then(function () { clear(); });

                    $('#listfreezeTransactionTable').
                        bootstrapTable(
                            'refresh', { url: 'FreezeSetup/listfreezetransaction' });

                    $("#btnSaveFreezeTransaction").removeAttr("disabled");
                }
                else {
                    swal({ title: 'Freeze Transaction', text: 'Something went wrong: </br>' + result.toString(), Transaction: 'error' }).then(function () { clear(); });
                    $("#btnSaveFreezeTransaction").removeAttr("disabled");
                }
            },
            error: function (e) {
                swal({ title: 'Freeze Transaction', text: 'Freeze Transaction encountered an error', Transaction: 'error' }).then(function () { clear(); });
                $("#btnSaveFreezeTransaction").removeAttr("disabled");
            }
        });


    })
});


