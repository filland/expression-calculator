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
  let numbers = expr.split(" ").filter(element => isDigit(element));

  if (operators.length === 0) {
    return -1;
  }

  let numberCounter = 0;
  let operatorCounter = 0;

  while (numbers.length !== 1) {
    let number = numbers[numberCounter];
    let previousNumber = numbers[numberCounter - 1];
    if (isDigit(number) && isDigit(previousNumber)) {
      let operator = operators[operatorCounter];

      if (operators.includes("*") || operators.includes("/")) {
        if (precedence[operator] === 2) {
          numbers.splice(
            numberCounter - 1,
            2,
            evaluatePair(previousNumber, number, operator)
          );
          operators.splice(operatorCounter, 1);
          numberCounter = -1;
          operatorCounter = 0;
        } else {
          operatorCounter++;
        }
      } else {
        if (precedence[operator] === 1) {
          numbers.splice(
            numberCounter - 1,
            2,
            evaluatePair(previousNumber, number, operator)
          );
          operators.splice(operatorCounter, 1);

          numberCounter = -1;
          operatorCounter = 0;
        } else {
          operatorCounter++;
        }
      }
    }

    numberCounter++;
  }
  return numbers.pop();
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
