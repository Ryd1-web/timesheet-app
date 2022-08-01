$(function () {

    $('#vd_Password').keyboard({
        lockInput: false, // prevent manual keyboard entry
        layout: 'custom',
        customLayout: {
            'normal': [
				' 1 2 3 4 5 6 7 8 9 0 ',
				' q w e r t y u i o p ',
				' a s d f g h j k l ',
				' z x c v b n m ',
				'{shift} {accept} {enter}  {bksp}'
            ],
            'shift': [
				'~ ! @ # $ & *',
				'Q W E R T Y U I O P',
				'A S D F G H J K L',
				'Z X C V B N M',
				'{shift} {accept} {enter}  {bksp}'
            ]
        },
        restrictInput: true, // Prevent keys not in the displayed keyboard from being typed in
        preventPaste: true,  // prevent ctrl-v and right click
        autoAccept: true,
        usePreview: false,
        css: {
            // input & preview
            // "label-default" for a darker background
            // "light" for white text
            input: 'form-control dark',
            // keyboard container
            container: 'center-block well',
            // default state
            //buttonDefault: 'btn btn-primary',
            // hovered button
            buttonHover: 'btn-primary',
            // Action keys (e.g. Accept, Cancel, Tab, etc);
            // this replaces "actionClass" option
            buttonAction: 'active',
            // used when disabling the decimal button {dec}
            // when a decimal exists in the input area
            buttonDisabled: 'disabled'
        }, position: {
            // null (attach to input/textarea) or a jQuery object (attach elsewhere)
            of: $('#vd_Password'),
            my: 'center top',
            at: 'center top',
            // at2 is used when "usePreview" is false (centers keyboard at the bottom
            // of the input/textarea)
            at2: 'center bottom',
            collision: 'flipfit flipfit'
        }
    })
     //.addTyping()
     .addScramble({
         byRow: false,    // randomize by row, otherwise randomize all keys
         randomizeOnce: false     // if false, randomize every time the keyboard opens
     })

    $('#vd_ConfirmPassword').keyboard({
        lockInput: false, // prevent manual keyboard entry
        layout: 'custom',
        customLayout: {
            'normal': [
				' 1 2 3 4 5 6 7 8 9 0 ',
				' q w e r t y u i o p ',
				' a s d f g h j k l ',
				' z x c v b n m ',
				'{shift} {accept} {enter}  {bksp}'
            ],
            'shift': [
				'~ ! @ # $ & *',
				'Q W E R T Y U I O P',
				'A S D F G H J K L',
				'Z X C V B N M',
				'{shift} {accept} {enter}  {bksp}'
            ]
        },
        restrictInput: true, // Prevent keys not in the displayed keyboard from being typed in
        preventPaste: true,  // prevent ctrl-v and right click
        autoAccept: true,
        usePreview: false,
        css: {
            // input & preview
            // "label-default" for a darker background
            // "light" for white text
            input: 'form-control dark',
            // keyboard container
            container: 'center-block well',
            // default state
            //buttonDefault: 'btn btn-primary',
            // hovered button
            buttonHover: 'btn-primary',
            // Action keys (e.g. Accept, Cancel, Tab, etc);
            // this replaces "actionClass" option
            buttonAction: 'active',
            // used when disabling the decimal button {dec}
            // when a decimal exists in the input area
            buttonDisabled: 'disabled'
        }, position: {
            // null (attach to input/textarea) or a jQuery object (attach elsewhere)
            of: $('#vd_ConfirmPassword'),
            my: 'center top',
            at: 'center top',
            // at2 is used when "usePreview" is false (centers keyboard at the bottom
            // of the input/textarea)
            at2: 'center bottom',
            collision: 'flipfit flipfit'
        }
    })
        //.addTyping()
        .addScramble({
            byRow: false,    // randomize by row, otherwise randomize all keys
            randomizeOnce: false     // if false, randomize every time the keyboard opens
        })




    $('#ld_passcode').keyboard({
        lockInput: false, // prevent manual keyboard entry
        layout: 'custom',
        customLayout: {
            'normal': [
				' 1 2 3 4 5 6 7 8 9 0 ',
				' q w e r t y u i o p ',
				' a s d f g h j k l ',
				' z x c v b n m ',
				'{shift} {accept} {enter}  {bksp}'
            ],
            'shift': [
				'~ ! @ # $ & *',
				'Q W E R T Y U I O P',
				'A S D F G H J K L',
				'Z X C V B N M',
				'{shift} {accept} {enter}  {bksp}'
            ]
        },
        restrictInput : true, // Prevent keys not in the displayed keyboard from being typed in
        preventPaste : true,  // prevent ctrl-v and right click
        autoAccept: true,
        usePreview:false,
        css: {
            // input & preview
            // "label-default" for a darker background
            // "light" for white text
            input: 'form-control dark',
            // keyboard container
            container: 'center-block well',
            // default state
            //buttonDefault: 'btn btn-primary',
            // hovered button
            buttonHover: 'btn-primary',
            // Action keys (e.g. Accept, Cancel, Tab, etc);
            // this replaces "actionClass" option
            buttonAction: 'active',
            // used when disabling the decimal button {dec}
            // when a decimal exists in the input area
            buttonDisabled: 'disabled'
        }, position: {
            // null (attach to input/textarea) or a jQuery object (attach elsewhere)
            of: $('#ld_passcode'),
            my: 'center top',
            at: 'center top',
            // at2 is used when "usePreview" is false (centers keyboard at the bottom
            // of the input/textarea)
            at2: 'center bottom',
            collision: 'flipfit flipfit'
        }
    })
	//.addTyping()
    .addScramble({
        byRow: false,    // randomize by row, otherwise randomize all keys
        randomizeOnce: false     // if false, randomize every time the keyboard opens
    })


    // Script - typing extension
    // simulate typing into the keyboard, use:
    // \t or {t} = tab, \b or {b} = backspace, \r or \n or {e} = enter
    // added {l} = caret left, {r} = caret right & {d} = delete
    $('#inter-type').click(function () {
        $('#ld_passcode').getkeyboard().reveal();
            //.reveal().typein("{t}hal{l}{l}{d}e{r}{r}l'o{b}o {e}{t}world", 500);
        // close the keyboard if the keyboard is visible and the button is clicked a second time
        //if (kb.isopen) {
        //    kb.close();
        //} else {
        //    kb.reveal();
        //}
    });
    $('#pwd_Confirm').click(function () {
        $('#vd_ConfirmPassword').getkeyboard().reveal();
    });

    $('#pwd').click(function () {
        $('#vd_Password').getkeyboard().reveal();
    });

});


