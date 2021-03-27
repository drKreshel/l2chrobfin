export function calculate(expression: string) {

  /**
    * Evaluate an array of numbers and operators in string format,
    * and return a single number in string format. It will not parse parenthesis.
   * @param {Array}  array Array of strings containing numbers and operators. 
   * @return {string} string - Number result of the operation. 
   * @example
   * Input: ["1","+","2"]
   * Output: "3"
   */
  function evaluate(exp:any) {
    // check for negatives at the beggining of the expression
    if (exp[0] === "-" && exp[1]) {
      exp[0] = -1 * exp[1];
      exp.splice(1, 1);
    }

    let j = 0;
    // multiplication and division (allowing things like "2 * -2" or "2 / -4")
    while (j < exp.length) {
      if (exp[j] === "*") {
        if (exp[j + 1] === "-") {
          exp[j + 1] = -1 * exp[j + 2];
          exp.splice(j + 2, 1);
          j--;
        } else {
          exp[j - 1] = exp[j - 1] * exp[j + 1];
          exp.splice(j, 2);
          j--;
        }
      }
      if (exp[j] === "/") {
        if (exp[j + 1] === "-") {
          exp[j + 1] = -1 * exp[j + 2];
          exp.splice(j + 2, 1);
          j--;
        } else {
          exp[j - 1] = exp[j - 1] / exp[j + 1];
          exp.splice(j, 2);
          j--;
        }
      }
      j++;
    }

    // addition and substraction (allowing things like "2 + - 2" or "5 - - 2")
    j = 0;
    while (j < exp.length) {
      if (exp[j] === "+") {
        if (exp[j + 1] === "-") {
          exp.splice(j, 1);
          continue;
        } else {
          exp[j - 1] = exp[j - 1] * 1 + exp[j + 1] * 1;
          exp.splice(j, 2);
          j--
        }
      }
      if (exp[j] === "-") {
        if (exp[j + 1] === "-") {
          exp[j + 1] = -1 * exp[j + 2];
          exp.splice(j + 2, 1);
          j--;
        } else {
          exp[j - 1] = exp[j - 1] - exp[j + 1];
          exp.splice(j, 2);
          j--;
        }
      }
      j++;
    }
    return exp
  }

  /**
   * Transform a string math expression into an array.
   * @param {string} string math expression to be transformed to array
   * @return {Array} Array of strings of the math operation
   * @example
   * Input:"2 + - 4 * 5" 
   * Output:["2","+","-","4","*","5"]
   */
  function stringToArray(expression:any) {
    const str = expression.replace(/\s/g, "");
    const newArr = [];
    let i = 0;
    while (i < str.length) {
      if (str[i] === "(" || str[i] === ")" || str[i] === "+" || str[i] === "*" || str[i] === "/" || str[i] === "-") {
        newArr.push(str[i]);
        i++;
      } else {
        //pushing numbers into array, accounting for the fact that they might have decimals
        let num = "";
        while (isNaN(str[i]) === false || str[i] === ".") {
          num += str[i];
          i++;
        }
        newArr.push(num);
      }
    }
    return newArr;
  }


  let i = 0;
  /**
   * Evaluates recursively (see {@link evaluate}) an expression between 2 parenthesis
   * @param {Array}  array Array of strings containing numbers, operators and parenthesis. 
   * @return {string} string - Number result of the operation. 
   * @example
   * Input: ["1","+","2","+","(","4","*","4",")","+","2"]
   * Output: "16"
   */
  function parentheses(arr:string[]):string {
    let newArr = [];
    while (arr[i] !== ")" && i <= arr.length) {
      if (arr[i] === "(") {
        i++;
        //if nested parentheses we execute parentheses also in them
        newArr.push(parentheses(arr));
      }
      if (arr[i] === ")") {
        i++;
        return evaluate(newArr).toString();
      } else {
        newArr.push(arr[i]);
        i++;
      }
    }
    newArr = evaluate(newArr).toString()
    i++;
    return newArr;
  }

  function calc(expression:string) {
    const arr = stringToArray(expression);
    const newArr = [];
    i = 0;
    while (i < arr.length) {
      if (arr[i] === "(") {
        i++;
        newArr.push(parentheses(arr));
      }
      if (i < arr.length) newArr.push(arr[i]);
      i++;
    }
    return Number(evaluate(newArr))
  }

  return calc(expression)
}

//calculate("2 / (2 + (3+2)) * 4.33 - -6")
// calculate("12* 123/-(-5 + 2*((4*3)+2))")
// calculate("2--2")
