import math from 'mathjs';

function generateNumbers(): number[] {
  const selection: number[] = [];
  for (let i = 0; i < 6; i++) {
    selection.push(Math.floor(Math.random() * 100) + 1);
  }
  return selection;
}

function generateTarget(): number {
  return Math.floor(Math.random() * 899) + 101;
}

function evaluate_rpn(expression: string[]): number {
    const stack: number[] = [];
    for (const token of expression) {
        if (!isNaN(parseInt(token))) {
            stack.push(parseInt(token));
        } else {
            const b: any = stack.pop();
            const a: any = stack.pop();
            if (token === '+') {
                stack.push(a + b);
            } else if (token === '-') {
                stack.push(a - b);
            } else if (token === '*') {
                stack.push(a * b);
            } else if (token === '/') {
                stack.push(a / b);
            }
        }
    }
    return stack.pop()!;
}

function infix_to_rpn(infix: string[]): string[] {
    const precedence: {[key: string]: number} = {'+': 1, '-': 1, '*': 2, '/': 2, '(': 0};
    const stack: string[] = [];
    const rpn: string[] = [];
    for (const token of infix) {
        if (!isNaN(parseInt(token))) {
            rpn.push(token);
        } else if (token in precedence) {
            // @ts-ignore
            while (stack.length && precedence[token] && precedence[token] <= precedence[stack[stack.length - 1]]) {
                rpn.push(stack.pop()!);
            }
            stack.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                rpn.push(stack.pop()!);
            }
            stack.pop();
        }
    }
    while (stack.length) {
        rpn.push(stack.pop()!);
    }
    return rpn;
}

const numbers = generateNumbers();
const target = generateTarget();

// Print the numbers and target
console.log("Numbers: ", numbers);
console.log("Target: ", target);

// Find all possible combinations of numbers
// @ts-ignore
let combs = [];
for (let i = 2; i <= numbers.length; i++) {
    // @ts-ignore
    combs = combs.concat(math.combinations(numbers, i));
}

// Find all possible permutations of combinations
const perms = new Set();
for (const c of combs) {
    for (const p of math.permutations(c)) {
        perms.add(p);
    }
}

// Find all possible infix expressions
const infix = new Set<string>();
for (const p of perms) {
    // @ts-ignore
  for (const ops of math.product('+-*/', p.length -1)) {
    const expr = [];
    // @ts-ignore
    for (let i = 0; i < p.length-1; i++) {
        // @ts-ignore
      expr.push(`${p[i]} ${ops[i]}`);
    }
    // @ts-ignore
    expr.push(`${p[p.length-1]}`);
    infix.add(expr.join(' '));
  }
}


// Find all possible RPN expressions
const rpn = new Set<string>();
for (const i of infix) {
    // @ts-ignore
  rpn.add(infix_to_rpn(i.split()).join(' '));
}

// Find solutions using the RPN expressions
const solutions = new Set();
for (const r of rpn) {
    try {
        // @ts-ignore
        if (evaluate_rpn(r.split()) === target) {
            solutions.add(r);
        }
    } catch (error) {
        // Do nothing
    }
}

// Print the number of solutions and some example solutions
console.log("Number of solutions: ", solutions.size);
console.log("Example solutions: ", solutions);