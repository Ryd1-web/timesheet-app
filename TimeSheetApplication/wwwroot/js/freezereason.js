function freezeReasonOperationFormatter(value, row, index) {
    return [
        '<a style="color:white" class="edit btn btn-sm btn-warning d-none d-sm-inline mr-2"  title="Edit Freeze Reason">',
        '<i class="fas fa-edit"></i> ',
        '</a>',
        '<a style="color:white" class="remove btn btn-sm btn-danger"  title="Delete Freeze Reason">',
        '<i class="fas fa-trash"></i> ',
        '</a>'
    ].join('');
}
window.freezeReasonOperationEvents = {
    'click .edit': function (e, value, row, index) {
        debugger
        if (row.state = true) {
            var data = JSON.stringify(row);
            $("#rowId").val(row.id)
            $('#FreezeReasonUP').val(row.reason);
            
            $('#btnFreezeReasonUpdate').html('<i class="now-ui-icons ui-1_check"></i> Update Record');
            //$('#btnSaveFreezeReason').hide();
            $('#btnFreezeReasonUpdate').show();
            //$('#titleBSR1').hide();
            $('#titleBSR2').show();
            $('#FreezeReasonUpdateModal').modal('show');
        }
    },
    'click .remove': function (e, value, row, index) {
        debugger
        info = JSON.stringify(row);
        console.log(info);
        debugger;

        swal({
            title: "Are you sure?",
            text: "You are about to delete this record!",
            Reason: "warning",
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

                $.ajax({
                    url: '../FreezeSetup/RemoveFreezeReason',
                    Reason: 'POST',
                    data: { Id: row.id },
                    success: function (data) {

                        swal("Deleted succesfully");
                        //alert('Deleted succesfully');
                        $('#listfreezeReasonTable').
                            bootstrapTable(
                                'refresh', { url: '../FreezeSetup/listfreezereasontype' });
                        return

                    },

                    error: function (e) {
                        //alert("An exception occured!");
                        swal("An exception occured!");
                    }
                });

               

                //return false;
            }
            else {
                swal("Freeze Reason", "You cancelled delete freeze Reason.", "error");
            }
            /*$('#listfreezeTable').
                bootstrapTable(
                    'refresh', { url: '../FreezeSetup/listfreezereasontype' });*/
        });

       
    }
};
/*
$(document).ready(function ($) {
   
    $('#btnFreezeReasonUpdate').on('click', function () {
        debugger
        var active = false;
        var freezeReason = $('#FreezeReason').val();
        var Id = $('#rowId').val();
      
        // $("button[Reason=submit]").attr("disabled", "disabled");

        $.ajax({
            url: '../FreezeSetup/UpdateFreezeOperation',
            Reason: 'POST',
            data: { FreezeReason: freezeReason,rowId: Id },
            dataReason: "json",
            //headers: {
            //    'VerificationToken': forgeryId
            //},
            success: function (result) {
                alert(result);
                if (result.toString !== '' && result !== null) {
                    swal({ title: 'Freeze Reason', text: 'Freeze Reason updated successfully!', Reason: 'success' }).then(function () { clear(); });

                    $('#listfreezeTable').
                        bootstrapTable(
                            'refresh', { url: 'FreezeSetup/listfreezeReason' });

                    $("#btnFreezeReasonUpdate").removeAttr("disabled");
                }
                else {
                    swal({ title: 'Freeze Reason', text: 'Something went wrong: </br>' + result.toString(), Reason: 'error' }).then(function () { clear(); });
                    $("#btnFreezeReasonUpdate").removeAttr("disabled");
                }
            },
            error: function (e) {
                swal({ title: 'Freeze Reason', text: 'Freeze Reason encountered an error', Reason: 'error' }).then(function () { clear(); });
                $("#btnFreezeReasonUpdate").removeAttr("disabled");
            }
        });
    });

});
*/
$(document).ready(function () {

    $("#FreezeReasonModal2").on('hide.bs.modal', function () {
        //$('#btnFreezeReasonUpdate').hide();
        $('#btnSaveFreezeReason').show();

        $('#titleBSR1').show();
        //$('#titleBSR2').hide();
        //$('#Frizreason').val("");
    });

    //$('#btnFreezeReasonUpdate').hide();

    $("#btnSaveFreezeReason").click(function (event) {

        debugger

        event.preventDefault();
         var data = {};
        data.reason = $('#Frizreason').val();

        $.ajax({
            url: '../FreezeSetup/CreateFreezeReasonOperation',
            Reason: 'POST',
            data: data,
            dataType: "json",
            //headers: {
            //    'VerificationToken': forgeryId
            //},
            success: function (response) {
                // alert(result);

                if (response == true) {
                    swal({ title: 'Freeze Reason', text: 'Freeze Reason added successfully!', type: 'success' }).then(function () { });

                    $('#listfreezeReasonTable').
                        bootstrapTable(
                            'refresh', { url: 'FreezeSetup/listfreezereasontype' });

                    $("#btnSaveFreezeReason").removeAttr("disabled");
                    $('#FreezeReasonModal2').modal('hide');
                }
                else if (response == false) {
                    swal({ title: 'Freeze Reason', text: 'Freeze Reason added successfully.', type: 'success' }).then(function () { clear(); location.reload(true); });

                    $("#btnSaveFreezeReason").removeAttr("disabled");
                }

            },
            error: function (e) {
                swal({ title: 'Freeze Reason', text: 'Freeze Reason encountered an error', Reason: 'error' }).then(function () { });
                $("#btnSaveFreezeReason").removeAttr("disabled");

            }
        });

    }); 

    
});

$(document).ready(function ($) {
    
    $('#btnFreezeReasonUpdate').on('click', function (event) {
        debugger
        event.preventDefault(); 
        //var active = false;
        var freezeReason = $('#FreezeReasonUP').val();
        var Id = $('#rowId').val();
       
        // $("button[type=submit]").attr("disabled", "disabled");
        swal({
            title: "Are you sure?",
            text: "You are about to update this record!",
            Reason: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff9800",
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "No, cancel!",
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 1000);
                });
            }
        }).then(function (isConfirm) {
            //  if (isConfirm) {



            $.ajax({
                url: '../FreezeSetup/UpdateFreezeReasonOperation',
                type: 'POST',
                data: { FreezeReason2: freezeReason, rowId: Id },
                dataType: "json",
                //headers: {
                //    'VerificationToken': forgeryId
                //},
                success: function (result) {
                    //alert(result);
                    if (result.toString !== '' && result !== null) {
                        swal({ title: 'Freeze Reason', text: 'Freeze Reason updated successfully!', type: 'success' }).then(function () { });

                        $('#listfreezeReasonTable').
                            bootstrapTable(
                                'refresh', { url: 'FreezeSetup/listfreezereasontype' });

                        $("#btnFreezeReasonUpdate").removeAttr("disabled");
                        $('#FreezeReasonUpdateModal').modal('hide');
                    }
                    else {
                        swal({ title: 'Freeze Reason', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { });
                        $("#btnFreezeReasonUpdate").removeAttr("disabled");
                       
                    }
                    
                },
                error: function (e) {
                    swal({ title: 'Freeze Reason', text: 'Freeze Reason encountered an error', type: 'error' }).then(function () { });
                    //$('#FreezeReasonModal2').modal('hide');
                    $("#btnFreezeReasonUpdate").removeAttr("disabled");
                }
            });

            //return false;
            //   }

        }, function (isRejected) {

            swal("Freeze Reason", "You cancelled update freeze Reason.", "error");
                $('#FreezeReasonUpdateModal').modal('hide');
            return;
        }); 

                
       /* $.ajax({
            url: '../FreezeSetup/UpdateFreezeReasonOperation',
            type: 'POST',
            data: { FreezeReason2: freezeReason, rowId: Id },
            dataType: "json",
            //headers: {
            //    'VerificationToken': forgeryId
            //},
            success: function (result) {
                //alert(result);
                if (result.toString !== '' && result !== null) {
                    swal({ title: 'Freeze Reason', text: 'Freeze Reason updated successfully!', type: 'success' }).then(function () {  });

                    $('#listfreezeReasonTable').
                        bootstrapTable(
                            'refresh', { url: 'FreezeSetup/listfreezereasontype' });

                    $("#btnFreezeReasonUpdate").removeAttr("disabled");
                }
                else {
                    swal({ title: 'Freeze Reason', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { });
                    $("#btnFreezeReasonUpdate").removeAttr("disabled");
                }
            },
            error: function (e) {
                swal({ title: 'Freeze Reason', text: 'Freeze Reason encountered an error', type: 'error' }).then(function () {  });
                $("#btnFreezeReasonUpdate").removeAttr("disabled");
            }
        });*/
        $('#btnFreezeReasonUpdate').hide();  
        $('#btnSaveFreezeReason').show();
       
        $('#titleBSR1').show();
        $('#titleBSR2').hide();
        $('#FreezeReason2').val("");

    });

});

