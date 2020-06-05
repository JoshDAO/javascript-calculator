
//first, create calculator object

const calculator = {
    _display: document.getElementById('display'),  //this will be the property that will be updated as buttons are pushed
    _buttons: {
        _numbers: [ zero, one, two, three, four, five, six, seven, eight, nine, decimal],  
        _operators: [add, subtract, multiply, divide, clear, equals],    
    },
//    _memory: null,  //this will contain the first operand while the second operand is inputted
//    _memoryOperation: null, //this will contain either '+','-','*' or '/' and will be checked when equals is hit to determine the correct operation
//    _startNewDisplay: false, //will ensure display is overwritten after hitting an operator
    _calculatedDisplay: document.getElementById('current-result'), // will dynamically show current answer
    _calculation: "",

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
    get operatorButtons() {
        return this._buttons._operators;
    },
    // get memory(){
    //     return this._memory
    // },
    // set memory(newMemory){
    //     this._memory = newMemory;
    // },
    // get memoryOperation(){
    //     return this._memoryOperation
    // },
    // set memoryOperation(newOperator){
    //     this._memoryOperation = newOperator
    // },
    get calculatedDisplay() {
        return this._calculatedDisplay.innerHTML;
    },
    set calculatedDisplay(expression) {
        this._calculatedDisplay.innerHTML = result //will obtain result value in another method
    },

    numberButtonDisplay(event) {
        if (event.target === decimal && calculator.display.indexOf('.') !== -1){ // check to see if there is already a decimal point in the dislayed number
            return;  //dont accept another decimal input
        };

        if ( (calculator.display === '0' && event.target !== decimal) || calculator._startNewDisplay ) { // if inputting a digit when the display reads 0 OR an operator has just been pressed
        calculator._display.innerHTML = event.target.value;  //replace current display instead of concatenating to it
        calculator._startNewDisplay = false;
        } else {
            calculator._display.innerHTML += event.target.value; // else concatenate
        
        }
        calculator._calculation += event.target.value;
    },
    operatorOnPress(event) {
        //calculator.calculate()
        //calculator._memory = calculator._display.innerHTML;  //will store current displaed number to memory
        //calculator._memoryOperation = event.target.value;    //will store the appropriate operator in operatorMemory, so when equals is hit, we know which operator to use.
        //calculator._startNewDisplay = true;
        calculator._display.innerHTML += event.target.value;
        calculator._calculation += event.target.value
    },
    // calculate(event) {
    //     if ( !calculator._memory || !calculator._memoryOperation) {
    //         return
    //     };
    //     switch (calculator._memoryOperation) {
    //         case '+':
    //             calculator._display.innerHTML = parseFloat(calculator._memory) + parseFloat(calculator._display.innerHTML)
    //             calculator._memory = calculator._display.innerHTML;
    //             break;
    //         case '-':
    //             calculator._display.innerHTML = parseFloat(calculator._memory) - parseFloat(calculator._display.innerHTML)
    //             calculator._memory = calculator._display.innerHTML;
    //             break;
    //         case '*':
    //             calculator._display.innerHTML = parseFloat(calculator._memory) * parseFloat(calculator._display.innerHTML)
    //             calculator._memory = calculator._display.innerHTML;
    //             break;
    //         case '/':
    //             calculator._display.innerHTML = parseFloat(calculator._memory) / parseFloat(calculator._display.innerHTML)
    //             calculator._memory = calculator._display.innerHTML;
    //             break;
    //     }
    // },
    

    resetDisplay(event) { //used for clear button
        calculator._display.innerHTML = '0'
        calculator._memory = 0;
        calculator._memoryOperation = null;
    },
    calculateAddition(expression) {
        const splitExpression = expression.split('+');
        const numberExpression = splitExpression.map( element => this.calculateSubtraction(element));
        console.log(numberExpression);
        const result = numberExpression.reduce( (accumulator, currentValue) => {return accumulator + currentValue}, 0);
        return result;
    },
    calculateSubtraction(expression) {
        const splitExpression = expression.split('-');
        const numberExpression = splitExpression.map( element =>  this.calculateMultiplication(element));

        const result = numberExpression.slice(1).reduce( (accumulator, currentValue) => { return accumulator - currentValue}, numberExpression[0] ); // we need to use the first element as initialValue and only subtract subsequent
        return result;
    },
    calculateMultiplication(expression) {
        const splitExpression = expression.split('*');
        const numberExpression = splitExpression.map( element => this.calculateDivision(element));
        //console.log(numberExpression);
        const result = numberExpression.reduce( (accumulator, currentValue) => { return accumulator * currentValue}, 1 ); // use 1 as a constant to multiply everything by
        return result;
    },
    calculateDivision(expression) {
        const splitExpression = expression.split('/');
        const numberExpression = splitExpression.map( element => parseFloat(element));
        //console.log(numberExpression);
        const result = numberExpression.slice(1).reduce( (accumulator, currentValue) => { return accumulator / currentValue}, numberExpression[0] );
        return result;
    }
}
//
//
//make sure the calculator outputs '0' in the beginning

document.onload = calculator.resetDisplay();

//fill number buttons array
let numberList = document.querySelectorAll('.js-number');
calculator.numberButtons = numberList;
calculator.numberButtons.forEach( button => {
    button.value = parseInt(button.innerHTML) || '.';
    button.onclick = calculator.numberButtonDisplay;
});



//fill operator buttons array
let operatorList = document.querySelectorAll('.js-operator');
calculator.operatorButtons = operatorList
calculator.operatorButtons[0].value = '+';  //add values to be stored in memoryOperation
calculator.operatorButtons[1].value = '-';
calculator.operatorButtons[2].value = '*';
calculator.operatorButtons[3].value = '/';


//-----BUTTON EVENT LISTENERS-----

//add clear button functionality
clear.onclick = calculator.resetDisplay

//add general oprator button functionality
calculator.operatorButtons.slice(0,4).forEach( operatorButton => operatorButton.onclick = calculator.operatorOnPress); //add event listener to each of 4 operator buttons


equals.onclick = calculator.calculate;



// Maybe create a superclass for all buttons with the basic constructor, then create subclasses for numbers, operators etc.
// Operators will have unique functions but will share similar behaviour with respect to the display
// clear and equals will be their own buttons as they're unlike the others.

// Things to do:
// - get numbers keys to appear in the display. Treat them like strings and concatenate them into the calculator.display property. Decimal is classed as a number.
// - create a function which tests to ensure that a number cannot begin with >1 zero and decimal point cannot appear twice or more.
// - create memory variable which stores current value of calculations and will be returned upon hitting equals.
//
//
//
//
//
//
//
