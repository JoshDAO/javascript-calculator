
//first, create calculator object

const calculator = {
    _display: document.getElementById('display'),  //this will be the property that will be updated as buttons are pushed
    _buttons: {
        _numbers: [ zero, one, two, three, four, five, six, seven, eight, nine, decimal],  // these will be linked with elements later
        _operators: [add, subtract, multiply, divide, clear, equals],                      // as will these
    },
    _calculatedDisplay: document.getElementById('current-result'), // will dynamically show current answer
    _calculation: "", //this will have a similar value to the current display, but using the language recognised operators instead of the symbols on the operator keys. This will be what will be evaluated.
    allowDecimal: true, // validation to ensure no more than one decimal dot per number
    equalsReset: false, // this variable will determine if the user is starting a new calculation after hitting equals or continuing to operate on the answer.
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
    get calculation() {
        return this._calculation;
    },
    numberOnPress(event) {
        if (calculator.equalsReset) {  // we are NOT operating on the asnwer displayed in this case
            calculator.resetDisplay();  // so reset before input
            calculator.equalsReset = false; // reset variable
        }
        if (!calculator.allowDecimal && event.target === decimal){ // check to see if there is already a decimal point in the dislayed number
            return;  //dont accept another decimal input
        };
        if (event.target === decimal) {   // turns variable false after decimal point is used.
            calculator.allowDecimal = false;
        }

        if (calculator.display === '0' && event.target !== decimal) { // if inputting a digit when the display reads 0
            calculator._display.innerHTML = event.target.value;  //replace current display instead of concatenating to it
        } else {
            calculator._display.innerHTML += event.target.value; // else concatenate
        
        };

        calculator._calculation += event.target.value;
        if (calculator.calculateAddition(calculator._calculation)){
            calculator._calculatedDisplay.innerHTML = calculator.calculateAddition(calculator._calculation);
        }
    },
    operatorOnPress(event) {
        calculator.allowDecimal = true; // allows decimal point to be used again as start of a new number
        calculator.equalsReset = false; 

        //this test is to make sure invalid consecutive operators cannot be inputted
         if  (calculator.subsequentOperatorTest()){ //tests to see if current calculation ends with an operator
             if (!(event.target === subtract && (calculator._calculation.endsWith('*') || calculator._calculation.endsWith('/') ) ) ) {
                    calculator._display.innerHTML = calculator._display.innerHTML.slice(0, -1) //remove last character so it will be replaced with new operator
                    calculator._calculation = calculator._calculation.slice(0,-1);             // do same with calculation
             }
        }
        calculator._display.innerHTML += event.target.innerHTML; //add operator to display
        calculator._calculation += event.target.value  //add operator to calculation
    },
    resetDisplay(event) { //used for clear button
        calculator._display.innerHTML = ''
        calculator._calculatedDisplay.innerHTML = "";
        calculator._calculation = '';
    },
    equalsOnPress(event){
        calculator._display.innerHTML = calculator._calculatedDisplay.innerHTML; // make the calculated number appear big
        calculator._calculatedDisplay.innerHTML = ""; //remove the small display until further calculation
        calculator.equalsReset = true;
    },
    calculateAddition(expression) {
        if (expression.startsWith('-')) {
            expression = "1*-1* " +expression.substring(1);
        }
        const splitExpression = expression.split('+');
        console.log(splitExpression);
        const numberExpression = splitExpression.map( element => this.calculateSubtraction(element));
        const result = numberExpression.reduce( (accumulator, currentValue) => {return accumulator + currentValue}, 0);
        return result;
    },
    calculateSubtraction(expression) {
        let splitExpression = expression.split('-');
        for (let i = 0; i < splitExpression.length; i++){               // this is to fix a bug in the calculation where there is a double operator. EG. '5/-4'
            if (splitExpression[i].endsWith('/') || splitExpression[i].endsWith('*')) {  // if true, means that we are multiplying/dividing by negative number

                //shove the contents of the next element into this element and add a minus sign at beginning each time. Will handle multiple negative signs later
                splitExpression[i] = '-' + splitExpression[i].toString() + splitExpression[i+1].toString(); 
                splitExpression.splice(i+1, 1);                         //remove the element whose contents were shoved into [i]
                i--;                                                    // iterate over this array again incase of a chain of negative numbers.
            }
        }
      
        const numberExpression = splitExpression.map( element =>  this.calculateMultiplication(element));
        const result = numberExpression.slice(1).reduce( (accumulator, currentValue) => { return accumulator - currentValue}, numberExpression[0] ); // we need to use the first element as initialValue and only subtract subsequent
        return result;
    },
    calculateMultiplication(expression) {
        const splitExpression = expression.split('*');
        console.log(splitExpression);
        for (let i = 0; i < splitExpression.length; i++) { // this is to handle the minus signs that accumulated in calculateSubtraction()
            if (splitExpression[i].startsWith("--")){
                splitExpression[i] = splitExpression[i].substring(2); //two negatives cancel each other out so remove them.
                i--;                                                  // iterate over this element again in case of many minus signs.

            }
        }
        const numberExpression = splitExpression.map( element => this.calculateDivision(element));
        const result = numberExpression.reduce( (accumulator, currentValue) => { return accumulator * currentValue}, 1 ); // use 1 as a constant to multiply everything by
        return result;
    },
    calculateDivision(expression) {
        const splitExpression = expression.split('/');
        console.log(splitExpression);

        const numberExpression = splitExpression.map( element => parseFloat(element));
        //console.log(numberExpression);
        const result = numberExpression.slice(1).reduce( (accumulator, currentValue) => { return accumulator / currentValue}, numberExpression[0] );
        return result;
    },
    subsequentOperatorTest(){
        if (this.calculation.endsWith('-') || 
        this.calculation.endsWith('+') ||
        this.calculation.endsWith('*') ||
        this.calculation.endsWith('/') ) {
            return true
        } else {
            return false;            
        }
    }
}




//make sure the calculator outputs '0' in the beginning

document.onload = calculator.resetDisplay();

// ---- LINK ELEMENTS AND ASSIGN APPROPRIATE PROPERTIES ----

//fill number buttons array
let numberList = document.querySelectorAll('.js-number');
calculator.numberButtons = numberList;



//fill operator buttons array
let operatorList = document.querySelectorAll('.js-operator');
calculator.operatorButtons = operatorList
calculator.operatorButtons[0].value = '+';  //add values to be stored in memoryOperation
calculator.operatorButtons[1].value = '-';
calculator.operatorButtons[2].value = '*';
calculator.operatorButtons[3].value = '/';


//-----BUTTON EVENT LISTENERS-----

// add number button functionality
    calculator.numberButtons.forEach( button => {
        button.value = button.innerHTML;
        button.onclick = calculator.numberOnPress;
    });

//add clear button functionality
clear.onclick = calculator.resetDisplay

//add general operator button functionality
calculator.operatorButtons.slice(0,4).forEach( operatorButton => operatorButton.onclick = calculator.operatorOnPress); //add event listener to each of 4 operator buttons

//add equals functonality
equals.onclick = calculator.equalsOnPress;

