const display = document.getElementById("display");

function appendValue(value) {
    // Start a new calculation after an error
    if (display.value === "Error") {
        display.value = "0";
    }

    // Prevent multiple decimal points in one number
    if (value === ".") {
        const parts = display.value.split(/[\+\-\*\/%]/);
        const currentNumber = parts[parts.length - 1];

        if (currentNumber.includes(".")) {
            return;
        }
    }

    // Replace initial zero
    if (display.value === "0" && value !== ".") {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = "0";
}

function deleteNumber() {
    if (display.value === "Error" || display.value.length === 1) {
        display.value = "0";
    } else {
        display.value = display.value.slice(0, -1);
    }
}

function calculate() {
    try {
        let expression = display.value;

        // Convert percentage
        expression = expression.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // Only allow calculator characters
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const result = Function(
            `"use strict"; return (${expression})`
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        display.value = Number.isInteger(result)
            ? result
            : parseFloat(result.toFixed(10));

    } catch (error) {
        display.value = "Error";
    }
}

// Keyboard support
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if ("0123456789+-*/.%".includes(key)) {
        appendValue(key);
    }

    if (key === "Enter" || key === "=") {
        calculate();
    }

    if (key === "Backspace") {
        deleteNumber();
    }

    if (key === "Escape") {
        clearDisplay();
    }
});
