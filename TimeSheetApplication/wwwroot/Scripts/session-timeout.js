var currentIdleTime;
var maxIdleBeforeRedirectInMin = 3 * 60;
var idleAlertMessageTimeInMin = maxIdleBeforeRedirectInMin - (1 * 60);
var checkFunctionTimerInSec = 1 * 1000;
var alerted = false;

$(document).ready(function () {
    currentIdleTime = 0;
    // Event Listeners: Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        currentIdleTime = 0;
    });
    $(this).keypress(function (e) {
        currentIdleTime = 0;
    });

    setInterval(handleIdleness, checkFunctionTimerInSec);

    $('#lock').on('click', function (e) {
        debugger
        lockUser();
    });
});

function handleIdleness() {
    currentIdleTime++;
    if (currentIdleTime >= idleAlertMessageTimeInMin && !alerted) {
        // alert users about session timeout & set haveBeenAlerted to true
        swal({
            title: "Session Idle",
            text: "You would be logged out in a minute.",
            type: "warning",
            confirmButtonText: "Prevent logout"
        }).then(function (value) {
            currentIdleTime = 0;
            alerted = false;
        });
        alerted = true;
    }

    if (currentIdleTime >= maxIdleBeforeRedirectInMin) {
        $("#logoutForm").trigger("submit");
    }
}


function lockUser() {
    debugger

    swal({
        title: "Are you sure?",
        text: "Account Will Be Locked!!!",
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
    }).then(
        function (isConfirm) {
            if (isConfirm) {
                debugger;


                var json_data = {};

                json_data.lock = "Locked";

                debugger;
                $.ajax({
                    url: "../Account/LockUserAccount",
                    type: "POST",
                    data: json_data,
                    dataType: "json",
                    success: function (result) {
                        debugger
                        if (result.success == true) {
                            swal({ title: 'Lock Account', text: 'Account Locked Successfully', type: 'success' })
                                .then(function () {
                                    window.location.href = "../Account/Login";
                                });

                        }
                        else {
                            swal({ title: 'Lock Account', text: 'Something went wrong: </br>' + result.message, type: 'error' })



                        }
                    },
                    error: function (e) {

                        swal({ title: 'Lock Account', text: 'Locking Encountered an Error, Contact the Admin', type: 'error' }).then(function () { clear(); });
                        /*$("#btnUpdateChangeEmployer").removeAttr("disabled");*/
                    }
                });
            }
        }
    );

}