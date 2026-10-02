const P = (title, level, hint, sig, tests) => ({ title, level, hint, starter: `function solve(${sig}) {\n  \n}`, tests });
export const problems = {
  cse: [
    P("Sum of even numbers", "Beginner", "Return the sum of all even numbers from 1 to n.", "n", [[[10], 30], [[1], 0], [[7], 12], [[100], 2550]]),
    P("Reverse a string", "Beginner", "Return the string reversed.", "s", [[["abc"], "cba"], [["engineer"], "reenigne"], [[""], ""]]),
  ],
  ece: [
    P("Parallel resistance", "Beginner", "Return the equivalent resistance (ohms) of r1 and r2 in parallel.", "r1, r2", [[[100, 100], 50], [[1000, 3000], 750], [[10, 40], 8]]),
    P("Count set bits", "Intermediate", "Embedded task: return how many bits are 1 in the byte n.", "n", [[[7], 3], [[255], 8], [[0], 0], [[170], 4]]),
  ],
  mech: [
    P("Shaft power", "Beginner", "Power in kW from torque T (N·m) and speed rpm: P = 2π · rpm · T / 60 / 1000.", "T, rpm", [[[100, 1500], 15.708], [[50, 3000], 15.708], [[200, 1000], 20.944]]),
    P("Safe or unsafe?", "Intermediate", "Stress = force / area. Return \"safe\" if stress is at most the limit, else \"unsafe\".", "force, area, limit", [[[1000, 10, 120], "safe"], [[2000, 10, 150], "unsafe"], [[1500, 10, 150], "safe"]]),
  ],
  eee: [
    P("Real power", "Beginner", "Return real power P = V × I × pf.", "v, i, pf", [[[230, 5, 0.8], 920], [[120, 10, 1], 1200], [[415, 2, 0.5], 415]]),
    P("Three-phase power", "Intermediate", "Return P = √3 × VL × IL × pf (round-off within 0.01 is fine).", "vl, il, pf", [[[415, 10, 0.8], 5750.41], [[400, 20, 1], 13856.41], [[230, 5, 0.9], 1792.67]]),
  ],
  civil: [
    P("Beam maximum moment", "Beginner", "Simply supported beam with UDL: return M = w × L² / 8.", "w, l", [[[10, 6], 45], [[20, 4], 40], [[5, 10], 62.5]]),
    P("Concrete volume", "Beginner", "Return the volume (m³) of a slab with length, width and depth in metres.", "l, w, d", [[[5, 3, 0.2], 3], [[10, 2, 0.15], 3], [[4, 4, 0.25], 4]]),
  ],
  ads: [
    P("Mean of a list", "Beginner", "Return the mean of an array of numbers.", "arr", [[[[1, 2, 3, 4]], 2.5], [[[10, 20]], 15], [[[5]], 5]]),
    P("Above average", "Intermediate", "Return how many values are strictly greater than the mean.", "arr", [[[[1, 2, 3, 4, 10]], 1], [[[5, 5, 5]], 0], [[[1, 2, 3]], 1]]),
  ],
};
const Q = (q, o, a) => ({ q, o, a });
export const quizzes = {
  cse: [Q("Time complexity of binary search?", ["O(n)", "O(log n)", "O(n²)", "O(1)"], 1), Q("Which structure is First In, First Out?", ["Stack", "Queue", "Tree", "Graph"], 1), Q("What does [1,2,3].length return in JavaScript?", ["2", "3", "4", "undefined"], 1), Q("Which loop always runs at least once?", ["for", "while", "do-while", "foreach"], 2)],
  ece: [Q("Two equal resistors R in parallel give:", ["2R", "R", "R/2", "R²"], 2), Q("Which component stores charge?", ["Resistor", "Capacitor", "Diode", "Fuse"], 1), Q("A diode mainly allows current in:", ["Both directions", "One direction", "No direction", "Alternating only"], 1), Q("In embedded C, what does x & 1 check?", ["If x is zero", "The lowest bit of x", "If x is negative", "The highest bit"], 1)],
  mech: [Q("Stress is defined as:", ["Force × Area", "Force / Area", "Area / Force", "Force + Area"], 1), Q("Unit of torque:", ["N", "N·m", "Pa", "W"], 1), Q("Which law links force, mass and acceleration?", ["Newton's second law", "Hooke's law", "Boyle's law", "Ohm's law"], 0), Q("Hooke's law holds in which region?", ["Plastic", "Elastic", "Fracture", "Necking"], 1)],
  eee: [Q("Unit of reactive power:", ["W", "VAR", "VA", "J"], 1), Q("Power factor equals:", ["sin φ", "cos φ", "tan φ", "V × I"], 1), Q("A transformer works on:", ["DC only", "Electromagnetic induction", "Photoelectric effect", "Chemical reaction"], 1), Q("In a PID controller, the I term removes:", ["Noise", "Steady-state error", "Overshoot only", "Delay"], 1)],
  civil: [Q("Max moment of a simply supported beam with UDL:", ["wL/2", "wL²/8", "wL²/2", "wL/8"], 1), Q("Concrete gains strength mainly through:", ["Drying", "Hydration", "Freezing", "Heating"], 1), Q("Which test checks concrete workability?", ["Slump test", "Tensile test", "Impact test", "Hardness test"], 0), Q("A column mainly resists:", ["Tension", "Compression", "Torsion", "Fatigue"], 1)],
  ads: [Q("Mean of 2, 4, 6:", ["3", "4", "5", "6"], 1), Q("Which is a supervised learning task?", ["Clustering", "Classification", "Dimensionality reduction", "Association rules"], 1), Q("Overfitting means the model:", ["Does badly on training data", "Memorises training data and fails on new data", "Is too small", "Has no features"], 1), Q("Which Python library is common for dataframes?", ["Pandas", "Flask", "Pygame", "Tkinter"], 0)],
};
export const formulas = {
  cse: [["Binary search", "O(log n)"], ["Sum 1 to n", "n(n+1)/2"], ["Bits needed for n", "⌊log₂ n⌋ + 1"]],
  ece: [["Ohm's law", "V = I · R"], ["Parallel resistors", "R1·R2 / (R1+R2)"], ["Voltage divider", "Vout = Vin · R2 / (R1+R2)"]],
  mech: [["Stress", "σ = F / A"], ["Shaft power", "P = 2π · N · T / 60"], ["Hooke's law", "σ = E · ε"]],
  eee: [["Real power", "P = V · I · cos φ"], ["3-phase power", "P = √3 · VL · IL · cos φ"], ["Synchronous speed", "Ns = 120 · f / P"]],
  civil: [["Beam moment (UDL)", "M = wL² / 8"], ["Beam reaction", "R = wL / 2"], ["Concrete volume", "V = L × W × D"]],
  ads: [["Mean", "Σx / n"], ["Variance", "Σ(x − μ)² / n"], ["Accuracy", "correct / total"]],
};
const H = {
  "Sum of even numbers": ["Loop from 1 to n and test each number with i % 2 === 0.", "Keep a total, add i when it is even, and return the total at the end."],
  "Reverse a string": ["Split the string into characters with s.split('').", "Reverse the array with .reverse(), then join it back with .join('')."],
  "Parallel resistance": ["For two resistors the formula is (r1 × r2) / (r1 + r2).", "return (r1 * r2) / (r1 + r2);"],
  "Count set bits": ["Check the lowest bit with n & 1, then shift right with n >>= 1.", "Loop while n > 0: add (n & 1) to a counter, then shift n right by one bit."],
  "Shaft power": ["Start from P = 2π × rpm × T / 60, then divide by 1000 to get kW.", "return 2 * Math.PI * rpm * T / 60 / 1000;  (the arguments are T and rpm)"],
  "Safe or unsafe?": ["First find the stress: force / area.", "Compare stress <= limit and return the matching word."],
  "Real power": ["Real power multiplies voltage, current and power factor.", "return v * i * pf;"],
  "Three-phase power": ["Use Math.sqrt(3) for √3.", "return Math.sqrt(3) * vl * il * pf;"],
  "Beam maximum moment": ["Square the span first: l * l.", "return w * l * l / 8;"],
  "Concrete volume": ["The volume of a slab is length × width × depth.", "return l * w * d;"],
  "Mean of a list": ["Add all the numbers with a loop or reduce.", "Divide the sum by arr.length."],
  "Above average": ["Find the mean first, like in the previous problem.", "Count values where x > mean, for example arr.filter(x => x > mean).length."],
};
Object.values(problems).flat().forEach(p => { p.hints = H[p.title] || []; });

const add = (d, p) => problems[d].push(p);
add("cse", P("Valid brackets", "Advanced", "Return true if every ( [ { has a matching closing bracket in the right order.", "s", [[["()"], true], [["([)]"], false], [["{[]}"], true], [["((("], false]]));
add("ece", P("Resistor network", "Advanced", "R1 is in series with R2 and R3 in parallel. Return the total resistance.", "r1, r2, r3", [[[10, 20, 20], 20], [[100, 300, 600], 300], [[5, 10, 10], 10]]));
add("mech", P("Factor of safety", "Advanced", "Return yieldStrength divided by the working stress (force / area).", "yieldStrength, force, area", [[[250, 50000, 400], 2], [[300, 30000, 200], 2], [[400, 10000, 100], 4]]));
add("eee", P("Power factor correction", "Advanced", "Capacitor kVAR needed: Qc = P × (tan φ1 − tan φ2), where φ = acos(pf). Return Qc.", "p, pf1, pf2", [[[100, 0.8, 1], 75], [[200, 0.6, 0.8], 116.67], [[50, 0.9, 0.95], 7.78]]));
add("civil", P("Bending stress", "Advanced", "Rectangular beam: σ = 6M / (b × d²). M in N·mm, b and d in mm. Return σ in MPa.", "M, b, d", [[[10000000, 200, 500], 1.2], [[5000000, 100, 300], 3.33], [[20000000, 300, 600], 1.11]]));
add("ads", P("Min-max scaling", "Advanced", "Scale every value into 0 to 1 with (x − min) / (max − min). Return the new array.", "arr", [[[[0, 5, 10]], [0, 0.5, 1]], [[[2, 4, 6]], [0, 0.5, 1]], [[[10, 20, 30, 50]], [0, 0.25, 0.5, 1]]]));
Object.assign(H, {
  "Valid brackets": ["Use an array as a stack and push every opening bracket.", "On a closing bracket pop and check it matches. At the end the stack must be empty."],
  "Resistor network": ["First find r2 and r3 in parallel: r2 × r3 / (r2 + r3).", "return r1 + (r2 * r3) / (r2 + r3);"],
  "Factor of safety": ["Stress is force / area.", "return yieldStrength / (force / area);"],
  "Power factor correction": ["tan(acos(pf)) gives tan φ for a power factor.", "return p * (Math.tan(Math.acos(pf1)) - Math.tan(Math.acos(pf2)));"],
  "Bending stress": ["Square the depth: d * d.", "return 6 * M / (b * d * d);"],
  "Min-max scaling": ["Find min and max with Math.min(...arr) and Math.max(...arr).", "return arr.map(x => (x - min) / (max - min));"],
});
const T = { "Sum of even numbers": "Loops", "Reverse a string": "Strings", "Valid brackets": "Stacks", "Parallel resistance": "Circuits", "Count set bits": "Bit logic", "Resistor network": "Circuits", "Shaft power": "Power and torque", "Safe or unsafe?": "Stress", "Factor of safety": "Stress", "Real power": "Power", "Three-phase power": "Power", "Power factor correction": "Power", "Beam maximum moment": "Beams", "Concrete volume": "Quantities", "Bending stress": "Beams", "Mean of a list": "Statistics", "Above average": "Statistics", "Min-max scaling": "Data prep" };
const TR = {
  "Sum of even numbers": "Include n itself when n is even.",
  "Reverse a string": "split, reverse and join are three separate steps.",
  "Valid brackets": "Check that the stack is empty at the end, not only that nothing mismatched.",
  "Parallel resistance": "Parallel is not r1 + r2. Use product over sum.",
  "Count set bits": "Shift with >>= 1 each time or your loop never ends.",
  "Safe or unsafe?": "Stress equal to the limit is still safe, so use <=.",
  "Three-phase power": "Do not forget Math.sqrt(3).",
  "Beam maximum moment": "Square the span (l * l) before dividing by 8.",
  "Above average": "Use strictly greater than the mean, not >=.",
  "Min-max scaling": "Subtract the min from the top AND use (max - min) at the bottom.",
  "Power factor correction": "Math.acos needs a number from 0 to 1 and returns radians.",
};
Object.values(problems).flat().forEach(p => { p.hints = H[p.title] || []; p.topic = T[p.title] || "General"; p.trap = TR[p.title] || ""; });
