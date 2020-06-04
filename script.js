
//first, create calculator object

const calculator = {
    _display: document.getElementById('display'),  //this will be the property that will be updated as buttons are pushed
    _buttons: {
        _numbers: [ zero, one, two, three, four, five, six, seven, eight, nine, decimal],  
        _operators: ['add','subtract','multiply','divide'], 
        _clear: {},
        _equals: {}
    },

    get display() {  // basic getter function
        return this._display.innerHTML;
    },

    set display(newOutput) {        // setter function with built in Error capability for numbers too large or small. (may adjust this later)
        if (newOutput < 1e16 && newOutput > -1e16){
            this._display.innerHTML = newOutput;
        } else {
            this._display.innerHTML = 'Error';
        }
    },
    get numberButtons(){
        return this._buttons._numbers;
    },
    numberButtonDisplay(event) {
        calculator._display.innerHTML += event.target.value;
        console.log('logged')
    },
    
    resetDisplay() {
        this._display.innerHTML = 0; 
    }
}
//make sure the calculator outputs '0' in the beginning

document.onload = calculator.resetDisplay();
calculator.numberButtons.forEach( button => button.onclick = calculator.numberButtonDisplay)

//fill number buttons array
let numberList = document.querySelectorAll('.js-number');
calculator.numberButtons = numberList;
calculator.numberButtons.forEach( button => button.value = button.innerHTML);
calculator.numberButtons.forEach( button => button.onclick = calculator.numberButtonDisplay);




//create button objects and insert into calculator


const numberButtonFactory = (name, value) => {
    return {
         name,
         value,
         source: document.getElementById(name)
    }
}

        
//     }
// }
// iterate through arrays and use data to form button instances
//numberButtonID.forEach( (button, index) => calculator._buttons._numbers.push(new NumberButton(button, numberButtonValue[index])) );

// calculator.numberButtons.forEach( button => button.source.onclick = calculator.numberButtonPress)
// let one = document.getElementById('one');
// calculator.numberButtons.push(one)
// one.value = 1;

// Maybe create a superclass for all buttons with the basic constructor, then create subclasses for numbers, operators etc.
// Operators will have unique functions but will share similar behaviour with respect to the display
// clear and equals will be their own buttons as they're unlike the others.

// Things to do:
// - get numbers keys to appear in the display. Treat them like strings and concatenate them into the calculator.display property. Decimal is classed as a number.
// - create a function which tests to ensure that a number cannot begin with >1 zero and decimal point cannot appear twice or more.
// - 
//
//
//
//
//
//
//
