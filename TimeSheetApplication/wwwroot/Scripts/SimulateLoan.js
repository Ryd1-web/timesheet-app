
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
function PrintwindowSceen() {
    //window.print()
    $(document).ready(function ($) {
            
        debugger
        var printme = document.getElementById('tableId');
        //$('#ContributionTables').val();
        var wme = window.open("", "_parent", "width=372,height=755");
        //document.title("GENUINE VENTURE");
        wme.document.write(printme.outerHTML);
        wme.document.close();
        wme.focus();
        wme.print();
        wme.close();
    });
}

       function btnLoanSchedule() {
           debugger
           //$(document).ready(function(){
           //    $("#PaymentType").change(function(){

           // Declair and initialize the variables
           var eleId;
           var eleDat;
           //var loanName = document.form1.name.value;
           var loanAmount = document.form1.amount.value;
           var intRate = document.form1.rate.value;
           var numPay = document.form1.numPay.value;
           var eff_Date = document.form1.effDate.value;
           var fee = document.form1.fee.value;
           var loopNum;
           var tagNum;
           var tagNam;

           // Render the amortization table, this table displays the number of
           // rows specified by the number of payments input by the user in the numPay field.
           var monPmt = calcMonthly(loanAmount, numPay, intRate)
           amortizePmts(loanAmount, intRate, numPay, monPmt, eff_Date,fee);

           return;

           //    })
           //})
       }

function amortizePmts(loanAmount, intRate, numPay, monPmt, eff_Date,fee) {
    debugger;
    var value = $("#PaymentType").val();

    if (value == "Monthly") {
        //Removes Previous data from the grid before an onchange event occurs
        $('#tagName7').html("")
        $('#tagName1').html("")
        $('#tagName2').html("")
        $('#tagName3').html("")
        $('#tagName4').html("")
       
        var oldBalance = loanAmount;
        var newBalance = loanAmount;
        intRate = (intRate / 100) / 12;
        var monthly = monPmt;
        var owedInterest = 0;
        var totalInterestPd = 0;
        var tagNam;
        var dispInt
        // The for loop performs the amortization
        for (var i = 1; i <= numPay; i++) {
            var loopNum = i;
            owedInterest = newBalance * intRate;
            var feeCharge = oldBalance * (fee / 100);
            dispInt = twoDecimal(owedInterest);
            totalInterestPd = totalInterestPd + owedInterest;
            // Test for the final payment
            if (i < numPay) {
                monthly = twoDecimal(monPmt - dispInt);
                oldBalance = newBalance;
                newBalance = twoDecimal(oldBalance - monthly);
                var feeCharge = oldBalance * (fee / 100);
            }
            else {
                monthly = (oldBalance - monthly) + owedInterest;
                oldBalance = newBalance;
                newBalance = 0;
                monthly = twoDecimal(monthly);
                feeCharge = 0;
            }
            if (isNaN(fee)) {
                feeCharge = 0;
            }
            if (eff_Date == "") {
                payment_date = moment().add(i, "months").format("DD MMM, YYYY");

            } else {
                payment_date = moment(eff_Date).add(i, "months").format("DD MMM, YYYY");
                //var payment_date = new Date();
                //payment_date = payment_date.setMonth(payment_date.getMonth() + i)
            }
            $("tr").css("margin", "10px");
            $("#tagName0").append("<div><td>" + i + "</td></div>")
            $("#tagName7").append("<div><td>" + payment_date + "</td></div>")
            $("#tagName1").append("<div><td>" + oldBalance + "</td></div>")
            $("#tagName2").append("<div><td>" + monthly + "</td></div>")
            $("#tagName3").append("<div><td>" + dispInt + "</td></div>")
            $("#tagName4").append("<div><td>" + newBalance + "</td></div>")
            $("#tagName5").append("<div><td>" + totalInterestPd + "</td></div>")
            $("#tagName6").append("<div><td>" + feeCharge + "</td></div>")
        }
    } else if (value == "Quarterly") {
        //Removes Previous data from the grid before an onchange event occurs
        $('#tagName7').html("")
        $('#tagName1').html("")
        $('#tagName2').html("")
        $('#tagName3').html("")
        $('#tagName4').html("")
        intRate = (intRate / 100) / 4;
        numPay = numPay / 3;
        quarterPmt = (loanAmount * (Math.pow((1 + intRate), numPay)) * intRate / (Math.pow((1 + intRate), numPay) - 1));

        var oldBalance = loanAmount;
        var newBalance = loanAmount;
                
        var quarterly = quarterPmt;
        var owedInterest = 0;
        var totalInterestPd = 0;
        var tagNam;
        var dispInt
        // The for loop performs the amortization
        for (var i = 1; i <= numPay; i++) {
            //if (i % 3 == 0) {
            var loopNum = i;
            owedInterest = newBalance * intRate;
            dispInt = twoDecimal(owedInterest);
            totalInterestPd = totalInterestPd + owedInterest;
            // Test for the final payment
            if (i < numPay) {
                quarterly = twoDecimal(quarterPmt - dispInt);
                oldBalance = newBalance;
                newBalance = twoDecimal(oldBalance - quarterly);
            }
            else {
                quarterly = (oldBalance - quarterly) - owedInterest;
                oldBalance = newBalance;
                newBalance = 0;
                quarterly = twoDecimal(quarterly);
            }

            if (eff_Date == "") {
                payment_date = moment().add(i, "months").format("DD MMM, YYYY");

            } else {
                payment_date = moment(eff_Date).add(i*3, "months").format("DD MMM, YYYY");
                //var payment_date = new Date();
                //payment_date = payment_date.setMonth(payment_date.getMonth() + i)
            }
                   
            $("#tagName0").append("<p>" + i + "</p>")
            $("#tagName7").append("<p>" + payment_date + "</p>")
            $("#tagName1").append("<p>" + oldBalance + "</p>")
            $("#tagName2").append("<p>" + quarterly + "</p>")
            $("#tagName3").append("<p>" + dispInt + "</p>")
            $("#tagName4").append("<p>" + newBalance + "</p>")
            $("#tagName5").append("<p>" + totalInterestPd + "</p>")
        }
        //}

    } else if (value == "SemiAnnually") {
        //Removes Previous data from the grid before an onchange event occurs
        $('#tagName7').html("")
        $('#tagName1').html("")
        $('#tagName2').html("")
        $('#tagName3').html("")
        $('#tagName4').html("")

        var oldBalance = loanAmount;
        var newBalance = loanAmount;
        intRate = (intRate / 100) / 2;
        numPay = numPay / 6;
        midPmt = (loanAmount * (Math.pow((1 + intRate), numPay)) * intRate / (Math.pow((1 + intRate), numPay) - 1));
        var midYear = midPmt;
        var owedInterest = 0;
        var totalInterestPd = 0;
               
        var tagNam;
        var dispInt
        // The for loop performs the amortization
        for (var i = 1; i <= numPay; i++) {

            var loopNum = i;
            owedInterest = newBalance * intRate;
            dispInt = twoDecimal(owedInterest);
            totalInterestPd = totalInterestPd + owedInterest;
            // Test for the final payment
            if (i < numPay) {
                midYear = twoDecimal(midPmt - dispInt);
                oldBalance = newBalance;
                newBalance = twoDecimal(oldBalance - midYear);
            }
            else {
                midYear = (oldBalance - midYear) - owedInterest;
                oldBalance = newBalance;
                newBalance = 0;
                midYear = twoDecimal(midYear);
            }

            if (eff_Date == "") {
                payment_date = moment().add(i*6, "months").format("DD MMM, YYYY");

            } else {
                payment_date = moment(eff_Date).add(i*6, "months").format("DD MMM, YYYY");
                //var payment_date = new Date();
                //payment_date = payment_date.setMonth(payment_date.getMonth() + i)
            }
            //if (i % 6 == 0) {
            $("#tagName0").append("<p>" + i + "</p>")
            $("#tagName7").append("<p>" + payment_date + "</p>")
            $("#tagName1").append("<p>" + oldBalance + "</p>")
            $("#tagName2").append("<p>" + midYear + "</p>")
            $("#tagName3").append("<p>" + dispInt + "</p>")
            $("#tagName4").append("<p>" + newBalance + "</p>")
            $("#tagName5").append("<p>" + totalInterestPd + "</p>")
        }
        // }
    } else if (value == "Yearly") {
        var yearly = 0;
        //Removes Previous data from the grid before an onchange event occurs
        $('#tagName7').html("")
        $('#tagName1').html("")
        $('#tagName2').html("")
        $('#tagName3').html("")
        $('#tagName4').html("")

        var oldBalance = loanAmount;
        var newBalance = loanAmount;
        intRate = (intRate / 100);
        numPay = numPay / 12;
               
        var owedInterest = 0;
        var totalInterestPd = 0;
        var tagNam;
        var dispInt
        yearlyPmt = (loanAmount * (Math.pow((1 + intRate), numPay)) * intRate / (Math.pow((1 + intRate), numPay) - 1));
        yearly += parseFloat(yearlyPmt.toFixed(2));
        // The for loop performs the amortization
        for (var i = 1; i <= numPay; i++) {

            //var loopNum = i;
            owedInterest = newBalance * intRate;
            dispInt = unformatnumber(owedInterest);
            totalInterestPd = totalInterestPd + owedInterest;
            // Test for the final payment
            if (i < numPay) {
                yearly = unformatnumber(parseFloat(yearlyPmt) - dispInt);
                oldBalance = newBalance;
                newBalance = unformatnumber(oldBalance - parseFloat(yearly));
            }
            else {
                var yearlyPay = (oldBalance - parseFloat(yearly)) + owedInterest;
                oldBalance = newBalance;
                newBalance = 0;
                yearlyPay = parseFloat(twoDecimal(yearlyPay)) + parseFloat(oldBalance);
            }

            if (eff_Date == "") {
                payment_date = moment().add(i*12, "months").format("DD MMM, YYYY");

            } else {
                payment_date = moment(eff_Date).add(i*12, "months").format("DD MMM, YYYY");
                //var payment_date = new Date();
                //payment_date = payment_date.setMonth(payment_date.getMonth() + i)
            }
            //if (i % 12 == 0) {
            $("#tagName0").append("<p>" + i + "</p>")
            $("#tagName7").append("<p>" + payment_date + "</p>")
            $("#tagName1").append("<p>" + oldBalance + "</p>")
            $("#tagName2").append("<p>" + yearlyPay + "</p>")
            $("#tagName3").append("<p>" + dispInt + "</p>")
            $("#tagName4").append("<p>" + newBalance + "</p>")
            $("#tagName5").append("<p>" + totalInterestPd + "</p>")
        }
        // }
    }
    return;
}
function ShowIncome() {
    debugger
    //var loanName = document.form1.name.value;
    var loanAmount = document.form1.amount.value;
    var intRate = document.form1.rate.value;
    var numPay = document.form1.numPay.value;
    var eff_Date = document.form1.effDate.value;
    var income = document.form1.income.value;

    if (loanAmount != "" && intRate != "" && numPay != "" && eff_Date != "") {
        //document.getElementById("income").style.display = "block";
        $("#income").show();
    } else {
        var error = "Error : Form-Field cannot be empty";
        $("#ShowError").html(error)
    }
}
function unformatnumber(value) {
    return parseFloat(value.toString().replace(/,/g, "")).toFixed(2);
}
function Clear() {
    //var faceValue = unformatnumber($('#PrincipalAmount').val(''));
    var tenor = $('#Tenor').val('');
    var rate = $('#InterestRate').val('');
    var date = $('#EffectiveDate').val('');
}
function ValidateIncome() {
    debugger
    var faceValue = unformatnumber($('#PrincipalAmount').val());
    var tenor = $('#Tenor').val();
    var rate = $('#InterestRate').val();
    var date = $('#EffectiveDate').val();
    //var extra = $('#extra').val();
    var income = unformatnumber($('#incomeVal').val());
    if ((0.33333333333 * faceValue) > income) {
        Clear();
        $("#ValidateAmount").html("You are not eligible for this Loan, Reduce the amount you apply for")
        $("#tr2").show();
        $("#tr1").hide();
    } else {

        $("#ValidateIncome").html("Successful")
        $('#income').attr("disabled", "disabled");
        $("#tr2").hide();
        $("#tr1").show();
    }
}
function displayTableField(eleId, eleDat) {

    document.getElementById(eleId).append('<p>' + eleDat + '</p>');
    return;
}

function calcMonthly(principal, numPay, intRate) {
    var monthly;
    var intRate = (intRate / 100) / 12;
    var principal;
    // The accounting formula to calculate the monthly payment is
    //    M = P * ((I + 1)^N) * I / (((I + 1)^N)-1)
    // The following code  transforms this accounting formula into JavaScript to calculate the monthly payment
    monthly = (principal * (Math.pow((1 + intRate), numPay)) * intRate / (Math.pow((1 + intRate), numPay) - 1));
    return twoDecimal(monthly);
}
function calcQuarterly(principal, numPay, intRate) {
    var monthly;
    var intRate = (intRate / 100) / 4;
    var principal;
    // The accounting formula to calculate the monthly payment is
    //    M = P * ((I + 1)^N) * I / (((I + 1)^N)-1)
    // The following code  transforms this accounting formula into JavaScript to calculate the monthly payment
    monthly = (principal * (Math.pow((1 + intRate), numPay)) * intRate / (Math.pow((1 + intRate), numPay) - 1));
    return twoDecimal(monthly);
}

function twoDecimal(chgVar) {
    var chgVar;
    var twoDec = chgVar.toFixed(2);
    return twoDec;
}