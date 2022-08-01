function freezeDateOperationFormatter(value, row, index) {
    return [
        '<a class="edit btn btn-sm btn-warning d-none d-sm-inline mr-2"  title="Edit Freeze DateType">',
        '<i class="now-ui-icons ui-2_settings-90"></i> ',
        '</a>',
        '<a class="remove btn btn-sm btn-danger"  title="Delete Freeze DateType">',
        '<i class="now-ui-icons ui-1_simple-remove"></i> ',
        '</a>'
    ].join('');
}
window.freezeDateOperationEvents = {
    'click .edit': function (e, value, row, index) {
        debugger
        if (row.state = true) {
            var data = JSON.stringify(row);
            $("#rowId").val(row.id)
            $('#FreezeDateType').val(row.dateType);
            $('#FreezeDateTypeModal').modal('show');
            $('#btnFreezeDateTypeUpdate').html('<i class="now-ui-icons ui-1_check"></i> Update Record');
            $('#btnSaveFreezeDateType').hide();
            $('#btnFreezeDateTypeUpdate').show();
            $('#titleBSD1').hide();
            $('#titleBSD2').show();
        }
    },
    'click .remove': function (e, value, row, index) {
        debugger
        info = JSON.stringify(row);
        console.log(info);
        debugger;
        $.ajax({
            url: '../Setup/RemoveFreezeDateType',
            DateType: 'POST',
            data: { Id: row.id },
            success: function (data) {
                swal({
                    title: "Are you sure?",
                    text: "You are about to delete this record!",
                    DateType: "warning",
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
                        $('#listfreezeDateTypeTable').
                            bootstrapTable(
                                'refresh', { url: '../Setup/listfreezedatetype' });

                        //return false;
                    }
                    else {
                        swal("Freeze Date Type", "You cancelled delete freeze Date Type.", "error");
                    }
                    $('#listfreezeTable').
                        bootstrapTable(
                            'refresh', { url: '../Setup/listfreezedatetype' });
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
    $('#btnSaveFreezeDateType').hide();
    $('#btnFreezeDateTypeUpdate').show();
    $('#titleBSD1').hide();
    $('#titleBSD2').show();
    $('#btnFreezeDateTypeUpdate').on('click', function () {
        debugger
        var freezeDateType = $('#FreezeDateType').val();
        var Id = $('#rowId').val();

        // $("button[DateType=submit]").attr("disabled", "disabled");

        $.ajax({
            url: '../Setup/UpdateFreezeDateTypeOperation',
            DateType: 'POST',
            data: { FreezeDateType: freezeDateType, rowId: Id },
            dataDateType: "json",
            //headers: {
            //    'VerificationToken': forgeryId
            //},
            success: function (result) {
                alert(result);
                if (result.toString !== '' && result !== null) {
                    swal({ title: 'Freeze Date Type', text: 'Freeze Date Type updated successfully!', DateType: 'success' }).then(function () { clear(); });

                    $('#listfreezeTable').
                        bootstrapTable(
                            'refresh', { url: 'Setup/listfreezedatetype' });

                    $("#btnFreezeDateTypeUpdate").removeAttr("disabled");
                }
                else {
                    swal({ title: 'Freeze Date Type', text: 'Something went wrong: </br>' + result.toString(), DateType: 'error' }).then(function () { clear(); });
                    $("#btnFreezeDateTypeUpdate").removeAttr("disabled");
                }
            },
            error: function (e) {
                swal({ title: 'Freeze Date Type', text: 'Freeze Date Type encountered an error', DateType: 'error' }).then(function () { clear(); });
                $("#btnFreezeDateTypeUpdate").removeAttr("disabled");
            }
        });
    });

});
$(document).ready(function () {
    $('#btnSaveFreezeDateType').show();
    $('#btnFreezeDateTypeUpdate').hide();
    $('#titleBSD1').show();
    $('#titleBSD2').hide();
    $("#btnSaveFreezeDateType").click(function () {
        debugger
        var freezeDateType = $('#FreezeDateType').val();
        
        $.ajax({
            url: '../Setup/CreateFreezeDateTypeOperation',
            DateType: 'POST',
            data: { FreezeDateType: freezeDateType },
            dataType: "json",
            //headers: {
            //    'VerificationToken': forgeryId
            //},
            success: function (result) {
                alert(result);
                if (result.toString !== '' && result !== null) {
                    swal({ title: 'Freeze Date Type', text: 'Freeze Date Type added successfully!', DateType: 'success' }).then(function () { clear(); });

                    $('#listfreezeDateTypeTable').
                        bootstrapTable(
                            'refresh', { url: 'Setup/listfreezedatetype' });

                    $("#btnSaveFreezeDateType").removeAttr("disabled");
                }
                else {
                    swal({ title: 'Freeze Date Type', text: 'Something went wrong: </br>' + result.toString(), DateType: 'error' }).then(function () { clear(); });
                    $("#btnSaveFreezeDateType").removeAttr("disabled");
                }
            },
            error: function (e) {
                swal({ title: 'Freeze Date Type', text: 'Freeze Date Type encountered an error', DateType: 'error' }).then(function () { clear(); });
                $("#btnSaveFreezeDateType").removeAttr("disabled");
            }
        });


    })
});


