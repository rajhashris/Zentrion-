export function diagnose(r) {
  const { got, exp, err } = r;
  if (err) return `Your code crashed here (${err}). Check the spelling of your variable names and that every bracket is closed.`;
  if (got === undefined) return "Your function returned nothing. Did you forget the return keyword?";
  if (typeof got !== typeof exp) return `We expected a ${typeof exp} but your code gave a ${typeof got}. Check what you return.`;
  if (typeof exp === "number") {
    if (Number.isNaN(got)) return "You got NaN. A name may be misspelt, or a value is not a number.";
    if (Math.abs(got - exp) <= 1) return "Very close! Look for an off-by-one in your loop or condition.";
    return "The number is off. Re-check the formula and the order of your steps.";
  }
  if (Array.isArray(exp)) return "The list is different. Check the order and the number of items.";
  return "The result does not match. Trace your code by hand with this input.";
}
export function diagnoseAnswer(input, c) {
  const x = parseFloat(input), y = parseFloat(c.ans);
  if (c.text) return "Not quite. Think about what the question is really asking, then try again.";
  if (!Number.isFinite(x)) return "Please type a number.";
  for (const k of [1000, 100, 10]) {
    if (Math.abs(x - y * k) < y * k * 0.01 || Math.abs(x - y / k) < (y / k) * 0.01) return `That looks like a units slip (a factor of ${k}). Check your units.`;
  }
  if (Math.abs(x - y) <= Math.abs(y) * 0.1) return "Very close! Check your rounding or one small step.";
  return "Not quite. Re-read the question and follow the method below.";
}
