$('.datepicker').datetimepicker({
    format: 'DD MMMM, YYYY',
    icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove',
        inline: true
    }
});
function formatnumber(value) {
    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function unformatnumber(value) {
    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2);
}

function valueFormatter(value, row, $element) {

    var format = parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var html = '<div class="price">' + format + '</div>';
    return html;

}
function dateFormatter(value, row, $element) {
    var format = moment(value).format('YYYY-MM-DD');
    var html = '<div>' + format + '</div>';
    return html;
}


$(document).ready(function () {


    $('#btnClear').on('click', function (e) {
        clear();
    });



    jQuery.validator.addMethod("greaterThanZero", function (value, element) {
        return this.optional(element) || (parseFloat(value) > 0);
    }, "Amount must be greater than zero");

   
    });


function clear() {
    location.reload();
}




    function calculate(loan_amt, months, rate, extra, eff_date) {


        i = rate / 100;
        var monthly_payment = loan_amt * (i / 12) * Math.pow((1 + i / 12), months) / (Math.pow((1 + i / 12), months) - 1);


        var current_balance = loan_amt;
        var payment_counter = 1;
        var total_interest = 0;
        var total_balance_paid = 0;
        var total_amount_paid = 0;


        monthly_payment = parseFloat(monthly_payment) + parseFloat(extra);

        var scheduleData = [];

        var payment_date;

        while (current_balance > 0) {
            towards_interest = (i / 12 * current_balance);

            if (monthly_payment > current_balance) {
                monthly_payment = current_balance + towards_interest;
            }

            towards_balance = monthly_payment - towards_interest;
            total_interest = total_interest + towards_interest;
            current_balance = current_balance - towards_balance;
            total_balance_paid += towards_balance;
            total_amount_paid = total_balance_paid + total_interest;

            if (eff_date == "") {
                payment_date = moment().add(payment_counter, "months").format("DD MMM, YYYY");

            } else {
                payment_date = moment(eff_date).add(payment_counter, "months").format("DD MMM, YYYY");
            }


            payment_counter++;

            scheduleData.push({
                payment_counter: payment_counter - 1,
                payment_date: payment_date,
                monthly_payment: monthly_payment,
                towards_balance: towards_balance,
                towards_interest: towards_interest,
                total_interest: total_interest,
                current_balance: current_balance,
                total_balance_paid: total_balance_paid,
                total_amount_paid: total_amount_paid
            });

        }

        return scheduleData;

    }


    function calculatesummary(loan_amt, months, rate, extra, eff_date) {

        i = rate / 100;
        var monthly_payment = loan_amt * (i / 12) * Math.pow((1 + i / 12), months) / (Math.pow((1 + i / 12), months) - 1);


        var current_balance = loan_amt;
        var payment_counter = 1;
        var total_interest = 0;
        var total_balance_paid = 0;
        var total_amount_paid = 0;


        monthly_payment = parseFloat(monthly_payment) + parseFloat(extra);

        var scheduleData;

        var payment_date;

        while (current_balance > 0) {
            towards_interest = (i / 12 * current_balance);

            if (monthly_payment > current_balance) {
                monthly_payment = current_balance + towards_interest;
            }

            towards_balance = monthly_payment - towards_interest;
            total_interest = total_interest + towards_interest;
            current_balance = current_balance - towards_balance;
            total_balance_paid += towards_balance;
            total_amount_paid = total_balance_paid + total_interest;

            if (eff_date == "") {
                payment_date = moment().add(payment_counter, "months").format("DD MMM, YYYY");

            } else {
                payment_date = moment(eff_date).add(payment_counter, "months").format("DD MMM, YYYY");
            }


            payment_counter++;

        }
        scheduleData = {
            payment_counter: payment_counter - 1,
            payment_date: payment_date,
            monthly_payment: monthly_payment,
            towards_balance: towards_balance,
            towards_interest: towards_interest,
            total_interest: total_interest,
            current_balance: current_balance,
            total_balance_paid: total_balance_paid,
            total_amount_paid: total_amount_paid
        };
        return scheduleData;

    }


    function round(num, dec) {
        return (Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
    }


    $('#btnLoanSchedule').click(function () {

        debugger;
        var faceValue = unformatnumber($('#PrincipalAmount').val());
        var tenor = $('#Tenor').val();
        var rate = $('#InterestRate').val();
        var date = $('#EffectiveDate').val();
        var extra = $('#extra').val();

        if (extra == "") {
            extra = 0;
        }

        //calculate(loan_amt, months, rate, extra)
        var summarydata = calculatesummary(faceValue, tenor, rate, extra, date);

        $('#monthly_payment').text(formatnumber(summarydata.monthly_payment));
        $('#total_interest_paid').text(formatnumber(summarydata.total_interest));
        $('#last_pay_date').text(summarydata.payment_date);
        $('#total_installment').text(formatnumber(summarydata.payment_counter));
        $('#total_amount_paid').text(formatnumber(summarydata.total_amount_paid));

        var data = calculate(faceValue, tenor, rate, extra, date);
        $("#ScheduleTable").bootstrapTable('refresh');
        $('#ScheduleTable').bootstrapTable({
            data: data,
            columns: [
                {
                    field: 'payment_counter',
                    title: '',
                    sortable: true
                },
                {
                    field: 'payment_date',
                    title: 'Date',
                    sortable: true,
                    //formatter: dateFormatter
                },
                {
                    field: 'monthly_payment',
                    title: 'Payment',
                    align: 'right',
                    sortable: true,
                    formatter: valueFormatter
                },
                {
                    field: 'towards_balance',
                    title: 'Principal',
                    align: 'right',
                    sortable: true,
                    formatter: valueFormatter
                },
                {
                    field: 'total_balance_paid',
                    title: 'Total Principal Paid',
                    align: 'right',
                    sortable: true,
                    formatter: valueFormatter
                },
                {
                    field: 'towards_interest',
                    title: 'Interest',
                    align: 'right',
                    formatter: valueFormatter
                },
                {
                    field: 'total_interest',
                    title: 'Total Interest Paid',
                    align: 'right',
                    formatter: valueFormatter
                },
                {
                    field: 'total_amount_paid',
                    title: 'Total Amount Paid',
                    align: 'right',
                    formatter: valueFormatter
                },
                {
                    field: 'current_balance',
                    title: 'Balance',
                    align: 'right',
                    formatter: valueFormatter
                }
            ]
        });


    });

    $('#PrincipalAmount').change(function () {
        $('#PrincipalAmount').val(formatnumber($('#PrincipalAmount').val()));
    });

    $('#btnSend').on('click', function (e) {
        debugger;
        var forgeryId = $("#forgeryToken").val();
        var faceValue = unformatnumber($('#PrincipalAmount').val());
        var tenor = $('#Tenor').val();
        var rate = $('#InterestRate').val();
        var date = $('#EffectiveDate').val();
        var type = $('#TypeOfLoan').val();
        var narrate = $('#narration').val();

        $("input[type=submit]").attr("disabled", "disabled");

        $('#newloans').validate({
            rules: {
                Principal: { greaterThanZero: true }
            },
            messages: {
                PrincipalAmount: { required: "Principal is required" },
                Tenor: { required: "Tenor is required" },
                InterestRate: { required: "Rate is required" },
                EffectiveDate: { required: "Effective date is required" },
                TypeOfLoan: { required: "Loan type is required" }
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
                    text: "Loan request will now be processed!",
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
                            }, 1000);
                        });
                    }
                }).then(function (isConfirm) {
                    if (isConfirm) {
                        $("#btnSend").attr("disabled", "disabled");
                        debugger
                        $.ajax({
                            url: 'ApplyforLoan',
                            type: 'POST',
                            data: { PrincipalAmount: faceValue, TypeOfLoan: type, Rate: rate, narration: narrate, Tenor: tenor, EffectiveDate: date },
                            dataType: "json",
                            headers: {
                                'VerificationToken': forgeryId
                            },
                            success: function (result) {
                                if (result) {
                                    swal( { title: 'Loan', text: 'Request submitted successfully!', type: 'success' })
                                        .then(function () {
                                            clear();
                                        });
                                    $("#btnSend").removeAttr("disabled");
                                }
                                else {
                                    swal({ title: 'Loan', text: 'Something went wrong: </br>' + result.toString(), type: 'error' })
                                        .then(function () {
                                        clear();
                                        });
                                    $("#btnSend").removeAttr("disabled");
                                }
                            },
                            error: function (e) {
                                swal("Loan", "Request encountered an error: </br> incomplete or invalid entry." + e.responseText, "error");

                            }
                        });
                    }
                });
            }
        },
            function (dismiss) {
                swal({ title: 'Loan', text: 'You cancelled loan request.', type: 'error' }).then(function () {
                    clear();
                });
            });
    });

//});