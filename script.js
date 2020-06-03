//first, create calculator object

const calculator = {
    _display: document.getElementById('display'),  //this will be the property that will be updated as buttons are pushed
    _buttons: {
        _numbers: [],  //will fill this in using a class
        _operators: [], //will fill in using a class
        _clear: {},
        _equals: {}
    },

    get display() {  // basic getter function
        return this._display;
    },

    set display(newOutput) {        // setter function with built in Error capability for numbers too large or small. (may adjust this later)
        if (newOutput < 1e16 && newOutput > -1e16){
            this._display.innerHTML = newOutput;
        } else {
            this._display.innerHTML = 'Error';
        }
    },
    addButtons(type) { 
        let newButton = {
          value,
          source,  
        };
        this._buttons.push(newButton);
        return newButton;

    },
    buttonPress(obj) {
        this.display(button);
    }
}
//make sure the calculator outputs '0' in the beginning

calculator.display = 0;

//create button objects and insert into calculator

const numberButtonID = ['zero','one','two','three','four','five','six','seven','eight','nine','decimal']  //these values match the IDs of my numerical buttons in HTML

class NumberButton { //class to produce button objects from
    constructor(name) {
        this.name = name;
        this.source = document.getElementById(name);
    }
    displayNumber(){
        this.source.onclick( () => {
            buttonPress(this)
        })
    }
}

numberButtonID.forEach( button => calculator._buttons._numbers.push(new NumberButton(button)) );  //create an instance of the button using 

// Maybe create a superclass for all buttons with the basic constructor, then create subclasses for numbers, operators etc.
// Operators will have unique functions but will share similar behaviour with respect to the display
// clear and equals will be their own buttons as they're unlike the others.

//
