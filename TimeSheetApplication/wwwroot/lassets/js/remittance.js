function valueFormatter(value, row, $element) {
    var format = parseFloat(value.toString().replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var html = '<div class="price">' + format + '</div>';
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

function totalTextFormatter(data) {
    return 'Total';
}
function amountFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var identifier = 'txtDebit_' + index;
    var html = '<div>' + '<input id="' + identifier + '" type=' + '"text"' + ' value= "0.00" class="debit text-right" />' + '</div>';
    return html;
}

function codeFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var identifier = 'txtProduct_' + index;
    var html =  '<span id="' + identifier + '" >' + data.ProductAccountNo + '</span>';
    return html;
}

function totalPriceFormatter(data) {
    var html = '<div>' + '₦ <input id="txtTotal" type=' + '"text"' + ' value= "0.00" class="text-right" readonly />' + '</div>';
    return html;
}
window.GetTotalRecord = function (callback) {
    $.ajax({
        url: '../Balance/GetAllCustomerBalanceWithValue',
        type: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function (e) {
            alert("An exception occured!");
        }
    });

};



var $totalRecord;
$(function () {
    GetTotalRecord(function (result) {
        $totalRecord = result.length;
    });
});

window.GetBatchNumber = function (callback) {
    $.ajax({
        url: '../Remittance/BatchNumber',
        type: 'POST',
        success: function (data) {
            callback(data);
        },
        error: function (e) {
            alert("An exception occured!");
        }
    });

};
var $batchNumber;
$(function () {
    GetBatchNumber(function (result) {
        $batchNumber = result;
    });
});




window.inputEvents = {
    'change .debit': function (e, value, row, index) {

        var data = JSON.parse(JSON.stringify(row));

        var newValue = e.target.value;
        var oldValue = formatnumber(data.RawBalance);
        var identifier = '#txtDebit_' + index;

        if (parseFloat(unformatnumber(newValue)) > parseFloat(unformatnumber(oldValue))) {
            $(identifier).val(e.target.defaultValue);
            return false;
        }

        var valueDifference = parseFloat(unformatnumber($(identifier).val()));
 
        $(identifier).val(formatnumber(e.target.value));

        var total = 0;

        for (i = 0; i < parseInt($totalRecord) ; i++) {
            var identifier = '#txtDebit_' + i;
            total += parseFloat(unformatnumber($(identifier).val()));
        }

        $("#txtTotal").val(formatnumber(parseFloat(total)));

        $("#snTotalDebit").text(formatnumber(parseFloat(total)));
    }
};

$(document).ready(function () {
    $(function () {
        $('#debitAccountTable').bootstrapTable({
            url: '../Balance/GetAllCustomerBalanceWithValue',
            method: 'GET',
            uniqueId: 'ProductAccountNo',
            columns: [
                 {
                     field: 'ProductAccountNo',
                     title: 'Account No',
                     align: 'left',
                     formatter: codeFormatter
                 },
                 {
                     field: 'ProductName',
                     title: 'Product',
                     align: 'left'
                 }
                 ,
                 {
                     field: 'Balance',
                     title: 'Balance',
                     align: 'right',
                     footerFormatter: totalTextFormatter
                 },
                 {
                     title: 'Debit',
                     align: 'right',
                     formatter: amountFormatter,
                     footerFormatter: totalPriceFormatter,
                     events: inputEvents
                 }]

        });
    });
});


$(document).ready(function ($) {
    window.GetChurchMapping = function (callback) {
        $.ajax({
            url: '../Remittance/MappingstoChurch',
            type: 'GET',
            success: function (data) {
                callback(data);
            },
            error: function (e) {
                //  alert("An exception occured!");
            }
        });

    };

    window.GetTotalCreditRecord = function (remit, callback) {

        $.ajax({
            url: '../Remittance/ListofRemittance?remitType='+remit,
            type: 'GET',
            success: function (data) {
                callback(data);
            },
            error: function (e) {
                // alert("An exception occured!");
            }
        });

    };
});

var $totalAreaRecord, $totalZoneRecord, $totalProvinceRecord, $totalRegionRecord, $totalNationalRecord;

$(function () {
    var $churchArea, $churchZone, $churchProvince, $churchRegion, $churchNational;
    GetChurchMapping(function (data) {
        $churchArea = data.area;
        $churchZone = data.zone;
        $churchProvince = data.province;
        $churchRegion = data.region;
        $churchNational = data.national;

        if (data.area != 'null')
        { $("#snArea").text(data.area); } else { $("#snArea").text(''); }
        if (data.zone != "null")
        { $("#snZone").text(data.zone); } else { $("#snZone").text(''); }
        if (data.province != '')
        { $("#snProvince").text(data.province); } else { $("#snProvince").text(''); }
        if (data.region != "null")
        { $("#snRegion").text(data.region); } else { $("#snRegion").text(''); }
        if (data.national != '')
        { $("#snNational").text(data.national); } else { $("#snNational").text(''); }


        
    });

    GetTotalCreditRecord('Area', function (result) {
        $totalAreaRecord = result.length;
    });
    GetTotalCreditRecord('Zone', function (result) {
        $totalZoneRecord = result.length;
    });
    GetTotalCreditRecord('Province', function (result) {
        $totalProvinceRecord = result.length;
    });
    GetTotalCreditRecord('Region', function (result) {
        $totalRegionRecord = result.length;
    });
    GetTotalCreditRecord('National', function (result) {
        $totalNationalRecord = result.length;
    });
});



/*Area*/
function amountAreaFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var identifier = 'txtArea_' + index;
    var html = '<div>' + '<input id="' + identifier + '" type=' + '"text"' + ' value= "0.00" class="creditarea text-right" />' + '</div>';
    return html;
}

function codeAreaFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var identifier = 'txtProduct_' + index;
    var html = '<div>' + '<input id="' + identifier + '" type=' + '"text"' + ' value= "' + data.ProductAccountNo + '" />' + '</div>';
    return html;
}

function remittanceAreaFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var html = '<div>' + data.remittanceAccountName + ' : ' + data.remittanceAccountNo + '<br/> <b>' + data.remittance + '</b></div>';
    return html;
}

function totalAreaFormatter(data) {
    var html = '<div>' + '₦ <input id="txtAreaTotal" type=' + '"text"' + ' value= "0.00" class="text-right" readonly />' + '</div>';
    return html;
}

window.inputAreaEvents = {
    'change .creditarea': function (e, value, row, index) {

        var data = JSON.parse(JSON.stringify(row));

        var newValue = e.target.value;
        var identifier = '#txtArea_' + index;
     
        var valueDifference = parseFloat(unformatnumber($(identifier).val()));

        $(identifier).val(formatnumber(e.target.value));

        var total = 0;

        for (i = 0; i < parseInt($totalAreaRecord) ; i++) {
            var identifier = '#txtArea_' + i;
            total += parseFloat(unformatnumber($(identifier).val()));
        }

        $("#txtAreaTotal").val(formatnumber(parseFloat(total)));

        $("#snTotalArea").text(formatnumber(parseFloat(total)));
        var totalRemit =
          parseFloat(unformatnumber($("#snTotalArea").text())) +
          parseFloat(unformatnumber($("#snTotalZone").text())) +
          parseFloat(unformatnumber($("#snTotalProvince").text())) +
          parseFloat(unformatnumber($("#snTotalRegion").text())) +
          parseFloat(unformatnumber($("#snTotalNational").text()));

        $("#snTotalRemit").text(formatnumber(totalRemit));

    }
};

$(function () {
    $('#areaTable').bootstrapTable({
        url: '../Remittance/ListofRemittance?remitType=Area',
        method: 'GET',
        columns: [
             {
                 field: 'remittancecode',
                 title: 'Code',
                 align: 'left',
                 visible: false
             },
             {
                 field: 'remittance',
                 title: 'Remittance',
                 align: 'left',
                 formatter: remittanceAreaFormatter,
                 footerFormatter: totalTextFormatter
             },
             {
                 title: 'Credit',
                 align: 'right',
                 formatter: amountAreaFormatter,
                 footerFormatter: totalAreaFormatter,
                 events: inputAreaEvents
             }
        ]
    });

});




/* Zone */

function amountZoneFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var identifier = 'txtZone_' + index;
    var html = '<div>' + '<input id="' + identifier + '" type=' + '"text"' + ' value= "0.00" class="creditzone text-right" />' + '</div>';
    return html;
}

function totalZoneFormatter(data) {
    var html = '<div>' + '₦ <input id="txtZoneTotal" type=' + '"text"' + ' value= "0.00" class="text-right" readonly />' + '</div>';
    return html;
}

function remittanceZoneFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var html = '<div>' + data.remittanceAccountName + ' : ' + data.remittanceAccountNo + '<br/> <b>' + data.remittance + '</b></div>';
    return html;
}

window.inputZoneEvents = {
    'change .creditzone': function (e, value, row, index) {

        var data = JSON.parse(JSON.stringify(row));

        var newValue = e.target.value;
        var identifier = '#txtZone_' + index;

        var valueDifference = parseFloat(unformatnumber($(identifier).val()));

        $(identifier).val(formatnumber(e.target.value));

        var total = 0;

        for (i = 0; i < parseInt($totalZoneRecord) ; i++) {
            var identifier = '#txtZone_' + i;
            total += parseFloat(unformatnumber($(identifier).val()));
        }

        $("#txtZoneTotal").val(formatnumber(parseFloat(total)));

        $("#snTotalZone").text(formatnumber(parseFloat(total)));
        var totalRemit =
         parseFloat(unformatnumber($("#snTotalArea").text())) +
         parseFloat(unformatnumber($("#snTotalZone").text())) +
         parseFloat(unformatnumber($("#snTotalProvince").text())) +
         parseFloat(unformatnumber($("#snTotalRegion").text())) +
         parseFloat(unformatnumber($("#snTotalNational").text()));
        $("#snTotalRemit").text(formatnumber(totalRemit));

    }
};

$(function () {
    $('#zoneTable').bootstrapTable({
        url: '../Remittance/ListofRemittance?remitType=Zone',
        method: 'GET',
        columns: [
             {
                 field: 'remittancecode',
                 title: 'Code',
                 align: 'left',
                 visible:false
             },
             {
                 field: 'remittance',
                 title: 'Remittance',
                 align: 'right',
                 formatter: remittanceZoneFormatter,
                 footerFormatter: totalTextFormatter
             },
             {
                 title: 'Credit',
                 align: 'right',
                 formatter: amountZoneFormatter,
                 footerFormatter: totalZoneFormatter,
                 events: inputZoneEvents
             }
        ]
    });

});



/* Province */

function amountProvinceFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var identifier = 'txtProvince_' + index;
    var html = '<div>' + '<input id="' + identifier + '" type=' + '"text"' + ' value= "0.00" class="creditprovince text-right" />' + '</div>';
    return html;
}

function remittanceProvinceFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var html = '<div>' + data.remittanceAccountName + ' : ' + data.remittanceAccountNo + '<br/><b>' + data.remittance + '</b></div>';
    return html;
}

function totalProvinceFormatter(data) {
    var html = '<div>' + '₦ <input id="txtProvinceTotal" type=' + '"text"' + ' value= "0.00" class="text-right" readonly />' + '</div>';
    return html;
}

window.inputProvinceEvents = {
    'change .creditprovince': function (e, value, row, index) {

        var data = JSON.parse(JSON.stringify(row));

        var newValue = e.target.value;
        var identifier = '#txtProvince_' + index;

        var valueDifference = parseFloat(unformatnumber($(identifier).val()));

        $(identifier).val(formatnumber(e.target.value));

        var total = 0;

        for (i = 0; i < parseInt($totalProvinceRecord) ; i++) {
            var identifier = '#txtProvince_' + i;
            total += parseFloat(unformatnumber($(identifier).val()));
        }

        $("#txtProvinceTotal").val(formatnumber(parseFloat(total)));

        $("#snTotalProvince").text(formatnumber(parseFloat(total)));
        var totalRemit =
           parseFloat(unformatnumber($("#snTotalArea").text())) +
           parseFloat(unformatnumber($("#snTotalZone").text())) +
           parseFloat(unformatnumber($("#snTotalProvince").text()))+
           parseFloat(unformatnumber($("#snTotalRegion").text())) +
           parseFloat(unformatnumber($("#snTotalNational").text()));
        $("#snTotalRemit").text(formatnumber(totalRemit));

    }
};

$(function () {
    $('#provinceTable').bootstrapTable({
        url: '../Remittance/ListofRemittance?remitType=Province',
        method: 'GET',
        columns: [
             {
                 field: 'remittancecode',
                 title: 'Code',
                 align: 'left',
                 visible:false
             },
             {
                 field: 'remittance',
                 title: 'Remittance',
                 align: 'left',
                 formatter: remittanceProvinceFormatter,
                 footerFormatter: totalTextFormatter
             },
             {
                 title: 'Credit',
                 align: 'right',
                 formatter: amountProvinceFormatter,
                 footerFormatter: totalProvinceFormatter,
                 events: inputProvinceEvents
             }
        ]
    });

});




/* Region */
function amountRegionFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var identifier = 'txtRegion_' + index;
    var html = '<div>' + '<input id="' + identifier + '" type=' + '"text"' + ' value= "0.00" class="creditregion text-right" />' + '</div>';
    return html;
}

function totalRegionFormatter(data) {
    var html = '<div>' + '₦ <input id="txtRegionTotal" type=' + '"text"' + ' value= "0.00" class="text-right" readonly />' + '</div>';
    return html;
}

function remittanceRegionFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var html = '<div>' + data.remittanceAccountName + ' : ' + data.remittanceAccountNo + '<br/><b>' + data.remittance + '</b></div>';
    return html;
}

window.inputRegionEvents = {
    'change .creditregion': function (e, value, row, index) {

        var data = JSON.parse(JSON.stringify(row));

        var newValue = e.target.value;
        var identifier = '#txtRegion_' + index;

     
        var valueDifference = parseFloat(unformatnumber($(identifier).val()));

        $(identifier).val(formatnumber(e.target.value));

        var total = 0;

        for (i = 0; i < parseInt($totalRegionRecord) ; i++) {
            var identifier = '#txtRegion_' + i;
            total += parseFloat(unformatnumber($(identifier).val()));
        }

        $("#txtRegionTotal").val(formatnumber(parseFloat(total)));

        $("#snTotalRegion").text(formatnumber(parseFloat(total)));
        var totalRemit =
          parseFloat(unformatnumber($("#snTotalArea").text())) +
          parseFloat(unformatnumber($("#snTotalZone").text())) +
          parseFloat(unformatnumber($("#snTotalProvince").text())) +
          parseFloat(unformatnumber($("#snTotalRegion").text())) +
          parseFloat(unformatnumber($("#snTotalNational").text()));
        $("#snTotalRemit").text(formatnumber(totalRemit));

    }
};


$(function () {
    $('#regionTable').bootstrapTable({
        url: '../Remittance/ListofRemittance?remitType=Region',
        method: 'GET',
        columns: [
             {
                 field: 'remittancecode',
                 title: 'Code',
                 align: 'left',
                 visible: false
             },
             {
                 field: 'remittance',
                 title: 'Remittance',
                 align: 'left',
                 formatter:remittanceRegionFormatter,
                 footerFormatter: totalTextFormatter
             },
             {
                 title: 'Credit',
                 align: 'right',
                 formatter: amountRegionFormatter,
                 footerFormatter: totalRegionFormatter,
                 events: inputRegionEvents
             }
        ]
    });

});


/* National */
function amountNationalFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var identifier = 'txtNational_' + index;
    var html = '<div>' + '<input id="' + identifier + '" type=' + '"text"' + ' value= "0.00" class="creditnational text-right" />' + '</div>';
    return html;
}

function totalNationalFormatter(data) {
    var html = '<div>' + '₦ <input id="txtNationalTotal" type=' + '"text"' + ' value= "0.00" class="text-right" readonly />' + '</div>';
    return html;
}

function remittanceNationalFormatter(value, row, index) {
    var data = JSON.parse(JSON.stringify(row));
    var html = '<div>' + data.remittanceAccountName + ' : ' + data.remittanceAccountNo + '<br/><b>' + data.remittance + '</b></div>';
    return html;
}

window.inputNationalEvents = {
    'change .creditnational': function (e, value, row, index) {

        var data = JSON.parse(JSON.stringify(row));

        var newValue = e.target.value;
        var identifier = '#txtNational_' + index;

        var valueDifference = parseFloat(unformatnumber($(identifier).val()));

        $(identifier).val(formatnumber(e.target.value));

        var total = 0;

        for (i = 0; i < parseInt($totalNationalRecord) ; i++) {
            var identifier = '#txtNational_' + i;
            total += parseFloat(unformatnumber($(identifier).val()));
        }

        $("#txtNationalTotal").val(formatnumber(parseFloat(total)));

        $("#snTotalNational").text(formatnumber(parseFloat(total)));

    
        var totalRemit =
            parseFloat(unformatnumber($("#snTotalArea").text())) +
            parseFloat(unformatnumber($("#snTotalZone").text())) +
            parseFloat(unformatnumber($("#snTotalProvince").text()))+
            parseFloat(unformatnumber($("#snTotalRegion").text())) +
            parseFloat(unformatnumber($("#snTotalNational").text()));
       
        $("#snTotalRemit").text(formatnumber(totalRemit));
    }
};

$(function () {
    $('#nationalTable').bootstrapTable({
        url: '../Remittance/ListofRemittance?remitType=National',
        method: 'GET',
        columns: [
             {
                 field: 'remittancecode',
                 title: 'Code',
                 align: 'left',
                 visible: false
             },
             {
                 field: 'remittance',
                 title: 'Remittance',
                 align: 'left',
                 formatter: remittanceNationalFormatter,
                 footerFormatter: totalTextFormatter
             },
             {
                 title: 'Credit',
                 align: 'right',
                 formatter: amountNationalFormatter,
                 footerFormatter: totalNationalFormatter,
                 events: inputNationalEvents
             }
        ]
    });

});


window.BatchNumberExist = function (callback) {
    $.ajax({
        url: '../Remittance/IsBatchNumberExist?batchNumber=' + $("#snBatchNumber").text(),
        type: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function (e) {
            alert("An exception occured!");
        }
    });

};



function SaveRemittance() {

    var $debitTable = $('#debitAccountTable');

    var debitData = JSON.stringify($debitTable.bootstrapTable('getData'));

    $.each($.parseJSON(debitData), function (idx, obj) {
        var debitAmount = unformatnumber($('#txtDebit_' + idx).val());

        if (parseFloat(debitAmount) != 0.00) {
            $.ajax({
                url: '../Remittance/SaveRemittance',
                type: 'POST',
                data: { accountNumber: obj.ProductAccountNo, accountName: obj.ProductName, debitAmount: debitAmount, creditAmount: 0 },
                success: function (result) {
                    $responseDebit = result;
                },
                error: function (xhr, status, message) {
                    $responseDebit = message;
                }
            });
        }
    });


    /* Remittance for Area*/
    var $creditAreaTable = $('#areaTable');

    var creditData = JSON.stringify($creditAreaTable.bootstrapTable('getData'));

    $.each($.parseJSON(creditData), function (idx, obj) {
        var creditAmount = unformatnumber($('#txtArea_' + idx).val());

        if (parseFloat(creditAmount) != 0.00) {
            $.ajax({
                url: '../Remittance/SaveRemittance',
                type: 'POST',
                data: { accountNumber: obj.remittanceAccountNo, accountName: obj.remittanceAccountName + ': ' + obj.remittance, debitAmount: 0, creditAmount: creditAmount },
                success: function (result) {
                    $responseArea = result;
                },
                error: function (xhr, status, message) {
                    $responseArea = message;
                }
            });
        }
    });

    /* Remittance for Zone*/
    var $creditTable = $('#zoneTable');

    var creditData = JSON.stringify($creditTable.bootstrapTable('getData'));

    $.each($.parseJSON(creditData), function (idx, obj) {
        var creditAmount = unformatnumber($('#txtZone_' + idx).val());

        if (parseFloat(creditAmount) != 0.00) {
            $.ajax({
                url: '../Remittance/SaveRemittance',
                type: 'POST',
                data: { accountNumber: obj.remittanceAccountNo, accountName: obj.remittanceAccountName + ': ' + obj.remittance, debitAmount: 0, creditAmount: creditAmount },
                success: function (result) {
                    $responseZone = result;
                },
                error: function (xhr, status, message) {
                    $responseZone = message;
                }
            });
        }
    });

    /* Remittance for Province*/
    var $responseProvince;
    var $creditTable = $('#provinceTable');

    var creditData = JSON.stringify($creditTable.bootstrapTable('getData'));

    $.each($.parseJSON(creditData), function (idx, obj) {
        var creditAmount = unformatnumber($('#txtProvince_' + idx).val());

        if (parseFloat(creditAmount) != 0.00) {
            $.ajax({
                url: '../Remittance/SaveRemittance',
                type: 'POST',
                data: { accountNumber: obj.remittanceAccountNo, accountName: obj.remittanceAccountName + ': ' + obj.remittance, debitAmount: 0, creditAmount: creditAmount },
                success: function (result) {
                    $responseProvince = result;
                },
                error: function (xhr, status, message) {
                    $responseProvince = message;
                }
            });
        }
    });

    /* Remittance for Region*/
    var $creditTable = $('#regionTable');

    var creditData = JSON.stringify($creditTable.bootstrapTable('getData'));

    $.each($.parseJSON(creditData), function (idx, obj) {
        var creditAmount = unformatnumber($('#txtRegion_' + idx).val());

        if (parseFloat(creditAmount) != 0.00) {
            $.ajax({
                url: '../Remittance/SaveRemittance',
                type: 'POST',
                data: { accountNumber: obj.remittanceAccountNo, accountName: obj.remittanceAccountName + ': ' + obj.remittance, debitAmount: 0, creditAmount: creditAmount },
                success: function (result) {
                    $responseRegion = result;
                },
                error: function (xhr, status, message) {
                    $responseRegion = message;
                }
            });
        }
    });

    /* Remittance for National*/
    var $creditTable = $('#nationalTable');

    var creditData = JSON.stringify($creditTable.bootstrapTable('getData'));

    $.each($.parseJSON(creditData), function (idx, obj) {
        var creditAmount = unformatnumber($('#txtNational_' + idx).val());

        if (parseFloat(creditAmount) != 0.00) {
            $.ajax({
                url: '../Remittance/SaveRemittance',
                type: 'POST',
                data: { accountNumber: obj.remittanceAccountNo, accountName: obj.remittanceAccountName + ': ' + obj.remittance, debitAmount: 0, creditAmount: creditAmount },
                success: function (result) {
                    $responseNational = result;
                },
                error: function (xhr, status, message) {
                    $responseNational = message;
                }
            });
        }
    });
    
   
    $('#reviewTable').bootstrapTable({
        url: '../Remittance/ListSavedRemittance?batchNumber=' + $("#snBatchNumber").text(),
        method: 'GET',
        showRefresh: true,
        columns: [
             {
                 field: 'accountNumber',
                 title: 'Account',
                 align: 'left'
             },
             {
                 field: 'accountName',
                 title: 'Account Name',
                 align: 'left'
             },
             {
                 field: 'debitAmount',
                 title: 'Debit Amount',
                 align: 'left',
                 formatter: valueFormatter
             },
             {
                 field: 'creditAmount',
                 title: 'Credit Amount',
                 align: 'left',
                 formatter: valueFormatter
             }
        ]
    });

}



$(function () {
  $('#btnSaveRemittance').on('click', function (e) {

      $("#snBatchNumber").text($batchNumber);

      if(parseFloat(unformatnumber($("#snTotalRemit").text())) == parseFloat(unformatnumber($("#snTotalDebit").text())))
      {
          BatchNumberExist(function (result) {

              //alert(result);

              if (parseInt(result) == 0) {
                  SaveRemittance()
              }
              else {

                  alert("Batch already saved. You can update and save again!");

                  $.ajax({
                      url: '../Remittance/DeleteRemittance?batchNumber=' + $batchNumber,
                      type: 'POST',
                      success: function (result) {
                          //alert(result);

                          if (parseInt(result) != -10)
                          {
                              SaveRemittance()
                              refreshtables();
                              alert("Remittance record saved successfully!");
                          }
                          else {
                              alert("Sorry! this batch number has already been posted!");
                              refreshtables();
                          }
                         
                      },
                      error: function (xhr, status, message) {
                         
                      }
                  });
                
              }
          });

      }
      else
      {
          alert("The debit and credit amount must be equal. Check your submitted values");
      }
   

  });

});



$(function () {
    $('#btnViewRemittance').on('click', function (e){
        $('#reviewTable').bootstrapTable('refresh', { url: '../Remittance/ListSavedRemittance?batchNumber=' + $("#snBatchNumber").text() });
        $('#remittanceModal').modal('show');
    });
});

$(function () {
    $('#btnSubmitRemittance').on('click', function (e){
     
                $.ajax({
                    url: '../Remittance/SubmitRemittance?batchNumber=' + $("#snBatchNumber").text(),
                    type: 'POST',
                    success: function (result) {
                        //alert(result);
                    },
                    error: function (xhr, status, message) {
                        //alert(message);
                    }
                });

                $('#reviewTable').bootstrapTable('refresh', { url: '../Remittance/ListSavedRemittance?batchNumber=' + $("#snBatchNumber").text() });
                $('#remittanceModal').modal('show');
                refreshtables();
      
    });
});

function refreshtables()
{
    $('#debitAccountTable').bootstrapTable('refresh');
    $('#nationalTable').bootstrapTable('refresh');
    $('#regionTable').bootstrapTable('refresh');
    $('#provinceTable').bootstrapTable('refresh');
    $('#areaTable').bootstrapTable('refresh');
    $('#zoneTable').bootstrapTable('refresh');
}