//first, lets make sure the calculator outputs '0' in the beginning

const calculator = {
    _display: document.getElementById('display'),
    get display() {
        return this._display;
    },

    set display(newOutput) {
        if (newOutput < 1e16 && newOutput > -1e16){
            this._display.innerHTML = newOutput;
        } else {
            this._display.innerHTML = 'Error';
        }
    }
}

calculator.display = 400000000000000000000000000;
