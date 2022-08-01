$(document).ready(function () {
    
    $('#password').keyup(function () {
        $('#result').html(checkStrength($('#password').val()))
    })
    var strongRegex = new RegExp("^[a-zA-Z0-9]*$");

    function checkStrength(password) {
        var strength = 0
        if (password.length < 6) {
            $('#result').removeClass()
            $('#result').addClass('short')
            return '_length: Too short'
        }
        if (password.length > 6) strength += 1
        // If password contains both lower and uppercase characters, increase strength value.
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
        // If it has numbers and characters, increase strength value.
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
        // If it has one special character, increase strength value.
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
        // If it has two special characters, increase strength value.
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
        if (password.match(/^[a-zA-Z]+$/)) strength += 1
        if (password.match(/^[0-9]+$/)) strength += 1
        
        
        if (strongRegex.test(result)) {
            $('#result').removeClass()
            $('#result').addClass('strong');
            return '_Strength: Strong'
        }
       
        if (strength < 2) {
            $('#result').removeClass()
            $('#result').addClass('weak')
          
            return '_Strength: Weak'
        } else if (strength == 2) {
            $('#result').removeClass()
            $('#result').addClass('good')
           
            return '_Strength: Medium'
        } else if (strength > 2 ) {
            $('#result').removeClass()
            $('#result').addClass('strong')
     
            return '_Strength: Strong'
        }
    }
   
});