var key = $("#RSAKey").val();
var RSA = new JSEncrypt();
RSA.setPublicKey(key);


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



function valueFormatter(value, row, $element) {

    var format = parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var html = '<div class="price">' + format + '</div>';
    return html;

}
function dateFormatter(value, row, $element) {
    //var format = moment(value).format('DD MMM, YYYY');
    //var html = '<div>' + format + '</div>';
    var html = '<div>' + value + '</div>';
    return html;
}

function titleFormatter(value, row, $element) {
    //var format = moment(value).format('YYYY-MM-DD');
    var html = '<div>' + ' ACCOUNT STATEMENT ' + '</div>';
    return html;
}

function formatnumber(value) {
    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function unformatnumber(value) {
    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2);
}

function getHeight() {
    return $(window).height() - $('h1').outerHeight(true);
}


$(document).ready(function ()
{

    var accountNo = $('#AccountNo').val();
    var fromDate = $('#StartDate').val();
    var toDate = $('#EndDate').val();

    $('#valSkip').text(-20);
    $('#valTake').text(20);
      
    $('#StatementTable').bootstrapTable({
        url: '../SelfService/StatementOfAccount',
        method: 'get',
        queryParams: function (p) {
            return {
                accountNumber: RSA.encrypt($('#AccountNo').val()),
                startDate: RSA.encrypt($('#StartDate').val()),
                endDate: RSA.encrypt($('#EndDate').val()),
                skip: $('#valSkip').text(),
                take: $('#valTake').text()
            };
        },
        columns:[
             {
                 field: 'TransDate',
             title: 'Date',
             sortable: true,
             formatter: dateFormatter
             },
             {
                 field: 'Description',
             title: 'Description',
             sortable: true
             },
             {
                 field: 'DebitAmount',
             title: 'Debit Amount',
             align: 'right',
             formatter: valueFormatter
             },
             {
                 field: 'CreditAmount',
             title: 'Credit Amount',
             align: 'right',
              formatter: valueFormatter
             }
             ,
             {
                 field: 'Balance',
             title: 'Balance',
             align: 'right',
             formatter: valueFormatter
             }
             ],
        responseHandler: function (res) {
            //var flatArray = [];
            //$.each(res, function (i, element) {
            //    flatArray.push(JSON.flatten(element));
            //});
            //return flatArray;
          return res.details;
        }
           
        
    });

    //$(document).ready(function () {
    //    $('#btnPrintAccount').click(function () {
    //        debugger;
    //        var accountNo = $('#AccountNo').val();
    //        var StartDate = $('#StartDate').val();
    //        var EndDate = $('#EndDate').val();

    //        $.ajax({
    //            url: "../SelfService/StatementReceipt",
    //            type: "GET",
    //            data: { AccountNo: accountNo, startDate: StartDate, endDate: EndDate, reportOption: "1" },
    //            success: function () {
    //                $('#btnPrintAccount').attr('href', '../SelfService/StatementReceipt?AccountNo=' + accountNo + ',startDate =' + StartDate + ',endDate =' + EndDate + ',reportOption=1');
    //                console.log("Ok");
    //            }
    //        })
    //    })
    //})
 
    $(document).ready(function () {
       
        $('#AccountNo').change(function () {
        //$('#btnPrintAccount').click(function () {
            debugger
            var accountNo = $('#AccountNo').val();
            var StartDate = $('#StartDate').val();
            var EndDate = $('#EndDate').val();
            //$('#btnPrintAccount').attr('href', '../SelfService/StatementReceipt?AccountNo=' + accountNo + ',startDate =' + StartDate + ',endDate =' + EndDate + ',reportOption=1');
            //+ ',startDate =' + $('#StartDate').val() + ',endDate =' + $('#EndDate').val() + ',reportOption=1'
            $('#btnPrintAccount').attr('href', '../SelfService/StatementReceipt?AccountNo=' + $('#AccountNo').val() + '&reportOption=1');
            $('#btnPrintExcel').attr('href', '../SelfService/StatementReceipt?AccountNo=' + $('#AccountNo').val() + '&reportOption=2');

            $.ajax({
                url: '../SelfService/CustomerInformation',
                type: 'GET',
                success: function (result) {
                              
                    $('#accountName').val(result.CustomerName);
                    $('#branchCode').val(result.BranchCode);
                    $('#customerCode').val(result.CustomerCode);
                },
            });
        });
    })

   
    $('#btnRequest').click(function () {
        if( parseInt($('#valPage').val() )<= parseInt($('#valTotalPage').html()))
        {

        var skipVal;
        var takeVal;
        debugger;
        skipVal = parseInt($('#valSkip').text()) + 20;;
        takeVal = parseInt($('#valTake').text()) 
        $('#valSkip').text(skipVal);
        $('#valTake').text(takeVal);

        $('#valPage').val(parseInt($('#valPage').val()) + 1);
        //$('#valSkip').text(0);
        //$('#valTake').text(20);
        //$('#valPage').val(1);

        var accountNo = $('#AccountNo').val();
        var fromDate = $('#StartDate').val();
        var toDate = $('#EndDate').val();



        $.getJSON('../SelfService/StatementOfAccount', { accountNumber: accountNo, startDate: fromDate, endDate: toDate },
                    function (result) {
                        debugger;
                        $('#opening_balance').html(formatnumber(result.summary.OpeningBalance));
                        $('#closing_balance').html(formatnumber(result.summary.ClosingBalance));
                        $('#valTotalRecord').html(result.summary.RowCount);

                        var mod = parseInt(result.summary.RowCount) % 20;

                        if (parseInt(result.summary.RowCount) % 20 == 0) {
                            $('#valTotalPage').html(Math.floor(parseInt(result.summary.RowCount) / 20));
                        }
                        else {
                            $('#valTotalPage').html(Math.floor(parseInt(result.summary.RowCount) / 20) + 1);
                        }


                    });

        $("#StatementTable").bootstrapTable('refresh');

        }
    });


    $('#btnPrevious').click(function () {
        if (parseInt($('#valPage').val()) > 0) {
      
        var skipVal;
        var takeVal;
        skipVal = parseInt($('#valSkip').text()) - 20;;
        takeVal = parseInt($('#valTake').text())
        $('#valSkip').text(skipVal);
        $('#valTake').text(takeVal);
        $('#valPage').val(parseInt($('#valPage').val()) - 1);
        //$('#valSkip').text(0);
        //$('#valTake').text(20);
        //$('#valPage').val(1);

        var accountNo = $('#AccountNo').val();
        var fromDate = $('#StartDate').val();
        var toDate = $('#EndDate').val();


        $.getJSON('../SelfService/StatementOfAccount', { accountNumber: accountNo, startDate: fromDate, endDate: toDate },
                    function (result) {
                        debugger;
                        $('#opening_balance').html(formatnumber(result.summary.OpeningBalance));
                        $('#closing_balance').html(formatnumber(result.summary.ClosingBalance));
                        $('#valTotalRecord').html(result.summary.RowCount);

                        var mod = parseInt(result.summary.RowCount) % 20;

                        if (parseInt(result.summary.RowCount) % 20 == 0) {
                            $('#valTotalPage').html(Math.floor(parseInt(result.summary.RowCount) / 20));
                        }
                        else {
                            $('#valTotalPage').html(Math.floor(parseInt(result.summary.RowCount) / 20) + 1);
                        }


                    });

        $("#StatementTable").bootstrapTable('refresh');
        }

    });

  
 var startDate = new Date();
    var endDate = new Date();
  
    $("#StartDate").datetimepicker({
        useCurrent: true
    }).on('dp.show', function () {
        return $(this).data('DateTimePicker').defaultDate(new Date());
    });
    $("#EndDate").datetimepicker({
        useCurrent: false
    }).on('dp.show', function () {
        return $(this).data('DateTimePicker').defaultDate(new Date());
    });

    $("#StartDate").on("dp.change", function (e) {
        $('#EndDate').data("DateTimePicker").minDate(e.date);
    });
    $("#EndDate").on("dp.change", function (e) {
        $('#StartDate').data("DateTimePicker").maxDate(e.date);
    });

    $('#StartDate').val(moment($('#StartDate').val()).format('YYYY-MM-DD'));
    $('#EndDate').val(moment($('#EndDate').val()).format('YYYY-MM-DD'));

    $("#frmaccountstatement").on("submit", function (e) {
        debugger
        e.preventDefault();
        return false;
    });


    $('#btnLoad').click(function () {
        
        debugger;

        $('#valSkip').text(0);
        $('#valTake').text(20);
        $('#valPage').val(1);

        var accountNo = $('#AccountNo').val();
        var fromDate = $('#StartDate').val();
        var toDate = $('#EndDate').val();
            
        var encrypted_account = RSA.encrypt(accountNo);
        var encrypted_startdate = RSA.encrypt(fromDate);
        var encrypted_enddate = RSA.encrypt(toDate);

        $.getJSON('../SelfService/StatementOfAccount',
            { accountNumber: encrypted_account, startDate: encrypted_startdate, endDate: encrypted_enddate },
            function (result) {
                debugger
                $('#opening_balance').html(formatnumber(result.summary.OpeningBalance));
                $('#closing_balance').html(formatnumber(result.summary.ClosingBalance));
                $('#valTotalRecord').html(result.summary.RowCount);

                var mod = parseInt(result.summary.RowCount) % 20;

                if (parseInt(result.summary.RowCount) % 20 == 0) {
                    $('#valTotalPage').html(Math.floor(parseInt(result.summary.RowCount) / 20));
                }
                else {
                    $('#valTotalPage').html(Math.floor(parseInt(result.summary.RowCount) / 20) + 1);
                }

            }
        );
        

        $("#StatementTable").bootstrapTable('refresh');

       debugger

        var accountNo = $('#AccountNo').val();
        var fromDate = $('#StartDate').val();
        var toDate = $('#EndDate').val();
        var accountName = $('#accountName').val();
        var branchCode = $('#branchCode').val();
        var customerCode = $('#customerCode').val();

        $.ajax({  
            url: 'http://10.2.8.8:8087/BankStatement/connect/synchronize',
            type: 'POST',
            data: {
                customerCode: customerCode,
                companyCode: '1',
                branchCode: branchCode,
                accountNo: accountNo,
                accountName: accountName,
                startDate: fromDate,
                endDate: toDate,
                type: '2'
            },
            success: function (result) {
                $responseArea = result;
            },
            error: function (xhr, status, message) {
                $responseArea = message;
            }
        });


    });


    $('#valPage').change(function () {
        $('#valSkip').text((20 * parseInt($('#valPage').val()) ) - 20);
        
        $('#valTake').text(20);
        $("#StatementTable").bootstrapTable('refresh');
    });
});