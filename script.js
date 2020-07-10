
//first, create calculator object

const calculator = {
    _display: document.getElementById('display'),  //this will be the property that will be updated as buttons are pushed
    _buttons: {
        _numbers: [],  // these will be linked with elements later
        _operators: [],                      // as will these
    },
    _calculatedDisplay: document.getElementById('current-result'), // will dynamically show current answer
    _calculation: "", //this will have a similar value to the current display, but using the language recognised operators instead of the symbols on the operator keys. This will be what will be evaluated.
    allowDecimal: true, // validation to ensure no more than one decimal dot per number
    equalsReset: false, // this variable will determine if the user is starting a new calculation after hitting equals or continuing to operate on the answer.
    numOfBrackets: 0,
    get display() {  // basic getter function
        return this._display.innerHTML;
    },

    set display(newOutput) {        // setter function
        this._display.innerHTML += newOutput;
    },
    get numberButtons(){
        return this._buttons._numbers;
    },
    set numberButtons(newButtons) {
        this._buttons._numbers = newButtons;
    },
    get operatorButtons() {
        return this._buttons._operators;
    },
    set operatorButtons(newButtons){
        this._buttons._operators = newButtons
    },
    get calculation() {
        return this._calculation;
    },
    set calculation(value) {
        this._calculation += value;
    },
    numberOnPress(event) {
        if (calculator.display.endsWith(")")){
            return
        };
        if (calculator.equalsReset) {  // we are NOT operating on the answer displayed in this case
            calculator.resetDisplay();  // so reset before input
            calculator.equalsReset = false; // reset variable
        };
        if (!calculator.allowDecimal && event.target === decimal){ // check to see if there is already a decimal point in the dislayed number
            return;  //dont accept another decimal input
        };
        if (event.target === decimal) {   // turns variable false after decimal point is used.
            calculator.allowDecimal = false;
        };

        if ((((calculator.calculation[calculator.calculation.length -2] === "*" || // validaton to ensure numbers dont start with unecessary zeros
             calculator.calculation[calculator.calculation.length -2] === "/" ||
             calculator.calculation[calculator.calculation.length -2] === "+" ||
             calculator.calculation[calculator.calculation.length -2] === "-" ||
             calculator.calculation[calculator.calculation.length -2] === "(") && calculator.calculation[calculator.calculation.length -1] === "0") ||
             calculator.display === '0' )  && event.target !== decimal) { // if inputting a digit when the display reads 0 or the most recent number is 0
             calculator._display.innerHTML = calculator.display.substring(0, calculator.display.length -1) + event.target.value;
             calculator._calculation = calculator.calculation.substring(0, calculator.calculation.length -1)

               //replace current display instead of concatenating to it
        } else {
            calculator.display = event.target.value; // else concatenate
        
        };

        calculator._calculation += event.target.value;
        calculator.calculateBrackets();
            calculator._calculatedDisplay.innerHTML = calculator.calculateAddition(calculator._calculation);    
        if (calculator.numOfBrackets !== 0) {
            calculator._calculatedDisplay.innerHTML = "";
        }
       
    },
    operatorOnPress(event) {
        if (event.target == calculator.operatorButtons[5] && calculator.numOfBrackets === 0) {
            return
        };
        calculator._calculatedDisplay.innerHTML = "";

        calculator.allowDecimal = true; // allows decimal point to be used again as start of a new number
        calculator.equalsReset = false; 
        
        //this test is to make sure invalid consecutive operators cannot be inputted
         if  (calculator.subsequentOperatorTest() && event.target !== openbracket && event.target !== closebracket){ //tests to see if current calculation ends with an operator
             if (!(event.target === subtract && (calculator._calculation.endsWith('*') || calculator._calculation.endsWith('/') ) ) ) {
                 while (calculator._calculation.endsWith('*') || 
                        calculator._calculation.endsWith('/') ||
                        calculator._calculation.endsWith('+') || 
                        calculator._calculation.endsWith('-')) {
                            calculator._display.innerHTML = calculator._display.innerHTML.slice(0, -1) //remove last character so it will be replaced with new operator
                            calculator._calculation = calculator._calculation.slice(0,-1); // do same with calculation
                        }            
             }
        };
        if (calculator.display.endsWith("(") && event.target !== subtract){  // allow only negation after open bracket
            return
        };
        if (event.target == openbracket){
            calculator.numOfBrackets++
        };
        if (event.target == closebracket){
            calculator.numOfBrackets--
        };
        calculator.display = event.target.innerHTML; //add operator to display
        calculator.calculation = event.target.value  //add operator to calculation
        if (event.target == closebracket) {
            calculator.calculateBrackets();
            calculator._calculatedDisplay.innerHTML = calculator.calculateAddition(calculator._calculation);
        }
    },
    resetDisplay(event) { //used for clear button
        calculator._display.innerHTML = ''
        calculator._calculatedDisplay.innerHTML = "";
        calculator._calculation = '';
    },
    equalsOnPress(event){
        calculator._display.innerHTML = calculator._calculatedDisplay.innerHTML; // make the calculated number appear big
        calculator._calculatedDisplay.innerHTML = ""; //remove the small display until further calculation
        calculator._calculation = calculator.display //replace the calculation with the result of the calculation to prevent issues when operating on this value
        calculator.equalsReset = true;
    },

    //Below are the main calculation methods. The equation (a string) will be passed as an argument into calculateAddition.
    //calculateAddition will split the string into sub-equations at each '+' operator.
    //Those sub-equations are passed into similar methods that handle subtraction, then multiplication, then division.
    //The methods are in this order so that division is evaluated first, then the evaluated sub-equation is passed back to the multiplication method and further evaluated.
    //Lastly, once multiplication and division have been evaluated, it is passed back to calculateSubtraction, then calculateAddition - maintaining operator precedence rules.



    calculateAddition(expression) {
        expression = expression.replace(/--/g, "+");  // these deal with combinations of consecutive operators that arise from dealing with paretheses
        expression = expression.replace(/\+\+/g, "+");
        expression = expression.replace(/\+-/g, "-");
        if (expression.startsWith('+')){ // remove a redundant + sign from start of expression
          expression = expression.slice(1)
        };
        if (expression.startsWith('-')) { //this if statement deals with first number being a negative
            expression = "1*-1* " +expression.substring(1); // refactor equation so negative symbol is not at start and the split method below will work as intended.
        };
        console.log("addition: " + expression);
        const splitExpression = expression.split('+'); //split equation at every instance of plus sign

        for (let i = 0; i < splitExpression.length; i++){               // this is to fix a bug in the calculation where there is a double operator. EG. '5/+4'
            if (splitExpression[i].endsWith('/') || splitExpression[i].endsWith('*') ||
                splitExpression[i].endsWith('+') || splitExpression[i].endsWith('-')) {  

                //concatenate the next element onto the end of this element to create a new valid expression
                splitExpression[i] = splitExpression[i].toString() + splitExpression[i+1].toString(); 
                splitExpression.splice(i+1, 1);                         //remove the element whose contents were shoved into [i]
                i--;                                                    // iterate over this array again incase of a chain of negative numbers.
            }
        };
        for (let i = 0; i < splitExpression.length; i++) {  // This if statement is to fix a bug when dealing with exponential notation
            if (splitExpression[i].endsWith('E')) {  // a number '1E+30' was being split into ['1E', '30']
                splitExpression[i] = splitExpression[i] + splitExpression[i+1]; //so this line pushes those two elements back into the same element, restoring the number
                splitExpression.splice(i+1, 1); // remove the now redundant element
                i--; 
            }
        }
        const numberExpression = splitExpression.map( element => this.calculateSubtraction(element)); //numberExpression represents the array filled with all of the returned and evaluated sub-equations
        const result = numberExpression.reduce( (accumulator, currentValue) => {return accumulator + currentValue}, 0); //this method is calculating ADDITION, so reduce array to find the sum of its parts.
        console.log("Total: " + result)
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
      
        const numberExpression = splitExpression.map( element =>  this.calculateMultiplication(element)); //numberExpression is the array containing evaluated sub-equations from multiplication and division.
        const result = numberExpression.slice(1).reduce( (accumulator, currentValue) => { return accumulator - currentValue}, numberExpression[0] ); // we need to use the first element as initialValue and only subtract subsequent elements.
        return result;
    },
    calculateMultiplication(expression) {
        const splitExpression = expression.split('*');
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
        const numberExpression = splitExpression.map( element => parseFloat(element));
        const result = numberExpression.slice(1).reduce( (accumulator, currentValue) => { return accumulator / currentValue}, numberExpression[0] ); // again, use first element as initial value.
        return result;
    },
    calculateBrackets() {
        //this section is to handle multiplication bracket notation. Example "5(10)" should equal 50
        let sliceIndex = this._calculation.search(/[0-9]\(/) //find instances of digit followed by open bracket
        if (sliceIndex > -1) {
            this._calculation = this._calculation.slice(0, sliceIndex+1) + "*" + this._calculation.slice(sliceIndex + 1); // add a "*" between them so function picks it up
            this.calculateBrackets(); //restart function to check for multiple instances
        };

        let openBracket = this._calculation.lastIndexOf("("); //this will target innermost parentheses and solve it, removing 1 layer from the equation
        let closeBracket = this._calculation.indexOf(")", openBracket);
        if (openBracket !== -1 && closeBracket !== -1) { // in this case, there are brackets that need sorting
          let expressionSlice = this._calculation.slice(openBracket+1, closeBracket);  //slice that contains the expression 

          let arrayExpression = [...this._calculation]  //convert to array for splice purposes
          arrayExpression.splice(openBracket, closeBracket - openBracket + 1, this.calculateAddition(expressionSlice)); // replace expression including brackets with the result
          this._calculation = arrayExpression.join("") // convert back to string
          this.calculateBrackets();      //repeat to check for more parentheses
        };
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
calculator.numberButtons = [...document.querySelectorAll('.js-number')];



//fill operator buttons array
calculator.operatorButtons = [...document.querySelectorAll('.js-operator')];
calculator.operatorButtons[0].value = '+';  //add values to be stored in memoryOperation
calculator.operatorButtons[1].value = '-';
calculator.operatorButtons[2].value = '*';
calculator.operatorButtons[3].value = '/';
calculator.operatorButtons[4].value = '(';
calculator.operatorButtons[5].value = ')';


//-----BUTTON EVENT LISTENERS-----

// add number button functionality
    calculator.numberButtons.forEach( button => {
        button.value = button.innerHTML;
        button.onclick = calculator.numberOnPress;
    });

//add clear button functionality
clear.onclick = calculator.resetDisplay

//add general operator button functionality
calculator.operatorButtons.slice(0,6).forEach( operatorButton => operatorButton.onclick = calculator.operatorOnPress); //add event listener to each of 4 operator buttons

//add equals functonality
equals.onclick = calculator.equalsOnPress;

