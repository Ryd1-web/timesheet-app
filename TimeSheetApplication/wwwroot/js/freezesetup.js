$(document).ready(function ($) {
    $("#frmFreezeType").submit(function (e) {
        e.preventDefault();
    });
});


function freezeTypeOperationFormatter(value, row, index) {
    return [
        '<a style="color:white" class="edit btn btn-sm btn-warning d-none d-sm-inline mr-2"  title="Edit Freeze Type">',
        '<i class="fas fa-edit"></i> ',
        '</a>',
        '<a style="color:white" class="remove btn btn-sm btn-danger"  title="Delete Freeze Type">',
        '<i class="fas fa-trash"></i> ',
        '</a>'
    ].join('');
}
window.freezeTypeOperationEvents = {
    'click .edit': function (e, value, row, index) {
        if (row.state = true) {
            var data = JSON.stringify(row);
            $("#friztypeid").val(row.id)
            $('#updatefriztype').val(row.freezeType);
            if (row.active == true) {
                //$('#Active2').val(row.active);
                $('#upactive').prop("checked",true);
            } else {
                //$('#Active2').val(row.active);
                $('#upactive').prop("checked", false);
            }
            //$('#Active2:checked').val(row.active);
            $('#FreezeTypeUpdateModal').modal('show');
            $("#btnFreezeTypeUpdate").html('<i class="now-ui-icons ui-1_check"></i> Update Record');
            //$('#btnSaveFreezeType').hide();
            $('#btnFreezeTypeUpdate').show();
            //$('#titleBSF1').hide();
            $('#titleBSF2').show();

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
            type: "warning",
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
                    url: '../FreezeSetup/RemoveFreezeType',
                    type: 'POST',
                    data: { Id: row.id },
                    success: function (data) {
                        swal("Deleted succesfully");
                        //alert('Deleted succesfully');
                        $('#listfreezeTable').
                            bootstrapTable(
                                'refresh', { url: '../FreezeSetup/listfreezetype' });
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
                swal("Freeze Type", "You cancelled delete freeze type.", "error");
            }
           
        });
       
    }
};
$(document).ready(function ($) {

    //$("#FreezeTypeModal").on('hide.bs.modal', function () {
    //    $('#btnFreezeTypeUpdate').hide();
    //    $('#titleBSF2').hide();
    //    $('#btnSaveFreezeType').show();
    //    $('#titleBSF1').show();
    //    $('#FreezeType2').val("");
    //});
   
    $('#btnFreezeTypeUpdate').on('click', function (event) {
       /* $('#btnSaveFreezeType').hide();
        $('#titleBSF1').hide();
        $('#btnFreezeTypeUpdate').show();
        $('#titleBSF2').show();*/
        debugger
        event.preventDefault(); 


        //var upfriztype = {};
        //upfriztype.active = false;
        //upfriztype.freezeType = $("#updatefriztype").val();
        //upfriztype.Id = $("#friztypeid").val();
        //if ($("#upactive").is(':checked'))
        //    upfriztype.active = true;
        //else
        //    upfriztype.active = false;



      
        var active = $("#upactive").val();
        var freezeType = $("#updatefriztype").val();
        var Id = $("#friztypeid").val();
       if ($("#upactive").is(':checked'))
           active = true;
        else
           active = false;

        
       
                            $.ajax({
                                url: '../FreezeSetup/UpdateFreezeOperation',
                                type: 'POST',
                                data: { active: active, freezeType: freezeType, Id: Id},
                                dataType: "json",
                                //headers: {
                                //    'VerificationToken': forgeryId
                                //},
                                success: function (result) {
                                    //alert(result);
                                    if (result.toString !== '' && result !== null) {
                                        swal({ title: 'Freeze Type', text: 'Freeze Type updated successfully!', type: 'success' }).then(function () {  });

                                        $('#listfreezeTable').
                                            bootstrapTable(
                                                'refresh', { url: 'FreezeSetup/listfreezetype' });

                                        $("#btnFreezeTypeUpdate").removeAttr("disabled");
                                        $('#FreezeTypeUpdateModal').modal('hide');
                                        
                                        $('#updatefriztype').val("");
                                    }
                                    else {
                                        swal({ title: 'Freeze Type', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () {  });
                                        $("#btnFreezeTypeUpdate").removeAttr("disabled");
                                    }
                                },
                                error: function (e) {
                                    swal({ title: 'Freeze Type', text: 'Freeze Type encountered an error', type: 'error' }).then(function () {  });
                                    $("#btnFreezeTypeUpdate").removeAttr("disabled");
                                }
                            });

                       


    });

});


//$(document).ready//(function () {

//    //$('#btnFreezeTypeUpdate').hide();
//    //$('#titleBSF2').hide();

//    $("#btnSaveFreezeType").click(function (event) {

//        debugger

//        event.preventDefault(); 

//        var active = false;
//        var freezeType = $('#friztype').val();
       
//        if ($("#activity").is(':checked'))
//            active = true;
//        else
//             active = false;
//        // $("button[type=submit]").attr("disabled", "disabled");

//        swal({
//            title: "Are you sure?",
//            text: "You are about to create a new freeze type!",
//            Reason: "warning",
//            showCancelButton: true,
//            confirmButtonColor: "#ff9800",
//            confirmButtonText: "Yes, proceed",
//            cancelButtonText: "No, cancel!",
//            showLoaderOnConfirm: true,
//            preConfirm: function () {
//                return new Promise(function (resolve) {
//                    setTimeout(function () {
//                        resolve();
//                    }, 1000);
//                });
//            }
//        }).then(function (isConfirm) {
//            if (isConfirm) {

//                $.ajax({
//                    url: '../FreezeSetup/CreateFreezeOperation',
//                    type: 'POST',
//                    data: { Freezetype: freezeType, Active2: active },
//                    dataType: "json",
//                    //headers: {
//                    //    'VerificationToken': forgeryId
//                    //},
//                    success: function (result) {
//                        //alert(result);
//                        if (result.toString !== '' && result !== null) {
//                            swal({ title: 'Freeze Type', text: 'Freeze Type added successfully!', type: 'success' }).then(function () {  });

//                            $('#listfreezeTable').
//                                bootstrapTable(
//                                    'refresh', { url: 'FreezeSetup/listfreezetype' });

//                            $("#btnSaveFreezeType").removeAttr("disabled");
//                            $('#FreezeTypeModal').modal('hide');
//                            $('#friztype').val("");
//                        }
//                        else {
//                            swal({ title: 'Freeze Type', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () {  });
//                            $("#btnSaveFreezeType").removeAttr("disabled");
//                        }
//                    },
//                    error: function (e) {
//                        swal({ title: 'Freeze Type', text: 'Freeze Type encountered an error', type: 'error' }).then(function () {  });
//                        $("#btnSaveFreezeType").removeAttr("disabled");
//                    }
//                });
//                }

//                                }, function (isRejected) {

//                swal("Freeze Reason", "You cancelled freeze type Creation", "error");
//                $('#FreezeTypeModal').modal('hide');
//                return;
//            }); 
//       /* */

//        $('#friztype').val("");
//    })
//});






$(document).ready(function () {

    //$('#btnFreezeTypeUpdate').hide();
    //$('#titleBSF2').hide();

    $("#btnSaveFreezeType").click(function (event) {

        debugger

        event.preventDefault();
        var FrizTyp = {};
        //FrizTyp.active = $('#active').prop("checked"),
        //FrizTyp.freezeType = $('#friztype').val();
        FrizTyp.active = false;
        FrizTyp.freezeType = $('#friztype').val();

        if ($("#activity").is(':checked'))
            FrizTyp.active = true;
        else
            FrizTyp.active = false;
        // $("button[type=submit]").attr("disabled", "disabled");

       
                $.ajax({
                    url: '../FreezeSetup/CreateFreezeOperation',
                    type: 'POST',
                    data: FrizTyp,
                    dataType: "json",
                    //headers: {
                    //    'VerificationToken': forgeryId
                    //},
                    success: function (response) {

                        if (response == true) {
                            swal({ title: 'Freeze Type', text: 'Freeze Type added successfully!', type: 'success' }).then(function () { });

                            $('#listfreezeTable').
                                bootstrapTable(
                                    'refresh', { url: 'FreezeSetup/listfreezetype' });

                            $("#btnSaveFreezeType").removeAttr("disabled");
                            $('#FreezeTypeModal').modal('hide');
                            $('#friztype').val("");
                        }
                        else if (response == false) {
                            swal({ title: 'Freeze Type', text: 'An entry already exists for Freeze Type and only one is permitted.', type: 'error' }).then(function () { clear(); location.reload(true); });
                            
                            $("#btnSaveFreezeType").removeAttr("disabled");
                        }

                        //alert(result);
                        //if (result.toString !== '' && result !== null) {
                        //    swal({ title: 'Freeze Type', text: 'Freeze Type added successfully!', type: 'success' }).then(function () { });

                        //    $('#listfreezeTable').
                        //        bootstrapTable(
                        //            'refresh', { url: 'FreezeSetup/listfreezetype' });

                        //    $("#btnSaveFreezeType").removeAttr("disabled");
                        //    $('#FreezeTypeModal').modal('hide');
                        //    $('#friztype').val("");
                        //}
                        //else {
                        //    swal({ title: 'Freeze Type', text: 'Something went wrong: </br>' + result.toString(), type: 'error' }).then(function () { });
                        //    $("#btnSaveFreezeType").removeAttr("disabled");
                        //}
                    },
                    error: function (e) {
                        swal({ title: 'Freeze Type', text: 'Freeze Type encountered an error', type: 'error' }).then(function () { });
                        $("#btnSaveFreezeType").removeAttr("disabled");
                    }
                });
            

       
    })
});

