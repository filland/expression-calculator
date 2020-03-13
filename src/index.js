const precedence = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2
};

function expressionCalculator(expr) {
  let openingBracketIndex = -1;
  let closingBracketIndex = -1;

  for (let i = 0; i < expr.length; i++) {
    const element = expr.charAt(i);
    if (element === "(") {
      openingBracketIndex = i;
    }
    if (element === ")") {
      closingBracketIndex = i;
      break;
    }
  }

  if (openingBracketIndex === -1 && closingBracketIndex === -1) {
    return evaluateExpression(expr);
  } else if (openingBracketIndex !== -1 && closingBracketIndex !== -1) {
    let innerBracketsExpression = expr.substring(
      openingBracketIndex + 1,
      closingBracketIndex
    );
    let number = expressionCalculator(innerBracketsExpression);
    let newExpressionArr = expr.split("");
    newExpressionArr.splice(
      openingBracketIndex,
      closingBracketIndex - openingBracketIndex + 1,
      number
    );
    let newExpression = newExpressionArr.join("");
    return newExpression.indexOf("(") === -1
      ? evaluateExpression(newExpression)
      : expressionCalculator(newExpression);
  } else {
    throw new Error("ExpressionError: Brackets must be paired");
  }
}

function evaluateExpression(expr) {
  if (expr.indexOf(" ") === -1) {
    expr = expr.split("").join(" ");
  }

  let operators = expr.split(" ").filter(element => isOperator(element));
  let numbersBrackets = expr
    .split(" ")
    .filter(element => isDigit(element) || element === "(" || element === ")");

  if (operators.length === 0) {
    return -1;
  }

  let numberBracketCounter = 0;
  let currentOperatorIndex = 0;

  while (numbersBrackets.length !== 1) {
    let element = numbersBrackets[numberBracketCounter];
    let previous = numbersBrackets[numberBracketCounter - 1];
    if (isDigit(element) && isDigit(previous)) {
      let operator = operators[currentOperatorIndex];
      let num1 = previous;
      let num2 = element;
      let precedenceValue = precedence[operator];

      if (operators.includes("*") || operators.includes("/")) {
        if (precedenceValue === 2) {
          numbersBrackets.splice(
            numberBracketCounter - 1,
            2,
            evaluatePair(num1, num2, operator)
          );
          operators.splice(currentOperatorIndex, 1);
          numberBracketCounter = -1;
          currentOperatorIndex = 0;
        } else {
          currentOperatorIndex++;
        }
      } else {
        if (precedenceValue === 1) {
          numbersBrackets.splice(
            numberBracketCounter - 1,
            2,
            evaluatePair(num1, num2, operator)
          );
          operators.splice(currentOperatorIndex, 1);

          numberBracketCounter = -1;
          currentOperatorIndex = 0;
        } else {
          currentOperatorIndex++;
        }
      }
    }

    numberBracketCounter++;
  }
  return numbersBrackets.pop();
}

function isOperator(val) {
  if (val === "+" || val === "-" || val === "*" || val === "/") return true;
  return false;
}

function isDigit(val) {
  return !isNaN(parseFloat(val)) && !isNaN(val - 0);
}

function evaluatePair(numberOne, numberTwo, operation) {
  numberOne = parseFloat(numberOne);
  numberTwo = parseFloat(numberTwo);
  switch (operation) {
    case "*":
      return numberOne * numberTwo;
    case "/":
      if (numberTwo === 0) throw new Error("TypeError: Division by zero.");
      return numberOne / numberTwo;
    case "+":
      return numberOne + numberTwo;
    case "-":
      return numberOne - numberTwo;
  }
}

module.exports = {
  expressionCalculator
};
