import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[restrictInput]',
    host: {
        '(keypress)': 'onKeyPress($event)',
        '(paste)': 'onPaste($event)'
    }
})
export class RestrictInputDirective {

    @Input() restrictInput: string;
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    /** TODO: move regex in constants */
    private patterns = {
        number: /[^0-9]/,
        name: /[^A-Za-zñÑ(),.'-\s]/,
        alphanumeric: /[^A-Za-z0-9]/,
        alphanumericwithspace: /[^A-Za-z0-9 ]/,
        date: /[^0-9\/]/,
        username: /[^a-zA-Z0-9-_.@#%+!\s]/,
        currency: [/0-9\./]
    };

    onKeyPress($event: any) {
        let pattern = this.patterns[this.restrictInput];
        let keyCode = $event.which || $event.keyCode;
        let inputChar = String.fromCharCode($event.charCode);
        let validNonPrintingKey = this.isValidNonPrintingKey(keyCode, $event.ctrlKey);

        if (!validNonPrintingKey && pattern.test(inputChar)) {
            $event.preventDefault();
        }
    }

    onPaste($event: any) {
        let pattern = this.patterns[this.restrictInput];
        let re = new RegExp(pattern,"g");
        // Know bug: paste only works once you can't paste simultaneously
        // event.preventDefault(); // Prevent blink display of the unformatted data
        let formattedValue = $event.clipboardData.getData('text/plain').replace(re, '');
        // Add timeout to fix bug(original pasted value is appended on the formatted value)
		let modelVal = $event.target.value+formattedValue;
        setTimeout(() => {
            this.ngModelChange.emit(modelVal);
        }, 0);
    }

    isValidNonPrintingKey(code, ctrlKey) {
        if ([8, 9, 13, 27].indexOf(code) !== -1 ||
            (code == 65 && ctrlKey === true) || (code == 97 && ctrlKey === true) ||
            (code == 67 && ctrlKey === true) || (code == 99 && ctrlKey === true) ||
            (code == 86 && ctrlKey === true) || (code == 118 && ctrlKey === true) ||
            (code == 88 && ctrlKey === true) || (code == 120 && ctrlKey === true)) {
            return true;
        }
        return false;
    }

    /**
        HostListener for restricting special characters from mobile device.
    */
	@HostListener('keydown', ['$event'])
    handleKeyboardEvent(kbdEvent: KeyboardEvent) { 
        if(kbdEvent.key === "Unidentified"){
            let pattern = this.patterns[this.restrictInput];
            let re = new RegExp(pattern,"g");
            setTimeout(() => {
               let value = kbdEvent.target['value'] = kbdEvent.target['value'].replace(re, '');
                setTimeout(() => {
                    this.ngModelChange.emit(value);
                  }, 0);
              }, 0);
            
        }
     }
}