
var url_path = window.location.pathname;
if (url_path.charAt(url_path.length - 1) == '/') {
    url_path = url_path.slice(0, url_path.length - 1);
}
var url_path2 = url_path.substring(0, url_path.lastIndexOf("/"));
$(document).ready(function () {
    initValidation();

    $("#frmtype").submit(function (e) {
        e.preventDefault();
    });
});

function editTimeFormatter(value, row, index) {
    return [
        '<button type="button" class="edit btn btn-sm btn-info" title="UPDATE">',
        '<i class="fas fa-edit"></i>',
        '</button>'
    ].join('');
}

function deleteTimeFormatter(value, row, index) {
    return [
        '<button type="button" class="clockout btn btn-sm btn-danger" title="CLOCK OUT">',
        '<i class="fas fa-clock"></i>',
        '</button>'
    ].join('');
}



window.timeSheetEvents = {
    
    'click .edit': function (e, value, row, index) {
        debugger
        if (row.status =='Employee Clocked In') {

            swal({
                title: "Employee Clock In",
                type: "error",
                text: "You've clocked in for the day already please clock out to update"
            });

        } else {
            debugger
            var form = $("#frmtype");
            form.trigger("reset");
            if (row.state = true) {
                form.find("[name=staffNo]").val(row.staffNo);

                $('#btnAddcheckIn').hide();
                $("#btncheckInUpdate").show();
                $('#AddNewCheckIn').modal('show');

                $('#btncheckInUpdate').click(function (event) {
                    event.preventDefault();
                    var form = $("#frmtype");

                    if (!form.valid()) {
                        return false;
                    }
                    swal({
                        title: "Are you sure?",
                        text: "TimeSheet will be updated!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#ff9800",
                        confirmButtonText: "Yes, continue",
                        cancelButtonText: "No, stop!",
                        showLoaderOnConfirm: true,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                setTimeout(function () {
                                    resolve();
                                }, 4000);
                            });
                        }
                    }).then(function (isConfirm) {
                        debugger
                        if (isConfirm) {

                            var data = {
                                StaffNo: row.staffNo,
                                TimeLoggedIn: row.timeLoggedIn,
                                Userid: row.userid,
                                Username: row.username
                            }
                            $.ajax({
                                url: '../CheckIn/UpdateTimeSheet',
                                method: 'POST',
                                data: data,
                                success: function (result) {

                                    debugger
                                    if (result== true) {
                                        debugger
                                        swal({
                                            title: 'TimeSheet Application Updated Successfully!', text: result.message, type: 'success'
                                        }).then(function () { window.location.reload(true); });
                                    
                                        $('#AddNewCheckIn').modal('show');
                                    }
                                 
                                   
                                },
                                error: function (e) {
                                    //alert("An exception occured!");
                                    swal("An exception occured!");
                                }
                            })
                        }

                    });
                });
            }
        }
    },
    'click .clockout': function (e, value, row, index) {
        debugger
        swal({
            title: "Are you sure?",
            text: "You are about to Clock out!",
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
                    }, 1000);
                });
            }
        }).then(function (isConfirm) {
            if (isConfirm) {
                var data = {
                    StaffNo: row.staffNo,
                    TimeLoggedIn: row.timeLoggedIn,
                    Userid: row.userid,
                    Username: row.username


                }
                debugger
                $.ajax({
                    url: url_path2 + "/AddClockOut",
                    method: 'POST',
                    data: data,
                    success: function (data) {
                        swal("Clock Out Successful");
                        $('#typeTable').bootstrapTable('refresh');
                    },
                    error: function (e) {
                        swal("An exception occured!");
                    }
                });
            }
        }, function (isRejected) {
            return;
        });
    }
};


function openCheckInModal() {
    var form = $("#frmtype");
    form.trigger("reset");
    form.find('#btnAddcheckIn').show();
    form.find("#btncheckInUpdate").hide();
    $('#AddNewCheckIn').modal('show');
}

function AddTimeSheet() {

    debugger
    event.preventDefault();
    var form = $("#frmtype");

    if (!form.valid()) {
        return false;
    }

    var data = {
        staffNo: $('#staffNo').val()
    }
    $.ajax({
        url:url_path2 + "/AddTimeSheet",
        type: "POST",
        data: {StaffNo: data.staffNo},
        dataType: "json",
        success: function (response) {

            if (response == true) {
                swal({
                    title: 'Welcome!', text: 'Clocked in Successfully Successfully!', type: 'success'
                }).then(function () { clear(); location.reload(true); });

               
            }
    
        },
        error: function (e) {
            //alert("An exception occured!");
            swal("An exception occured!");
        }
    })


    $("#AddNewCheckIn").modal("hide");

}



