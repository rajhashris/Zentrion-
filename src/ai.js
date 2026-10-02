import { departments } from "./data.jsx";
import { formulas } from "./content.js";

const kb = [
  [["ohm"], "Ohm's law says V = I × R. If you know any two of voltage, current and resistance, you can find the third."],
  [["parallel"], "For two resistors in parallel, R = (R1 × R2) / (R1 + R2). The result is always smaller than the smaller resistor."],
  [["divider"], "A voltage divider gives Vout = Vin × R2 / (R1 + R2). Try it in the ECE workbench."],
  [["stress", "strain"], "Stress is force per unit area (σ = F / A). Strain is the change in length divided by the original length. Hooke's law links them: σ = E × ε."],
  [["torque", "shaft"], "Torque is a twisting force, measured in N·m. Shaft power is P = 2π × N × T / 60, with N in rpm and T in N·m."],
  [["power factor", "cos φ"], "Power factor is cos φ, the ratio of real power to apparent power. Real power is P = V × I × cos φ."],
  [["three phase", "3 phase", "3-phase"], "Three-phase power is P = √3 × VL × IL × cos φ, using line voltage and line current."],
  [["beam", "moment", "udl"], "For a simply supported beam with uniform load w over span L, each support reaction is wL/2 and the maximum moment is wL²/8 at mid-span."],
  [["concrete", "hydration", "slump"], "Concrete gains strength through hydration, a chemical reaction with water, not by drying. The slump test checks how workable fresh concrete is."],
  [["binary search"], "Binary search halves a sorted list at each step, so it takes O(log n) time. It only works if the data is sorted."],
  [["stack", "queue"], "A stack is Last In, First Out (like a pile of plates). A queue is First In, First Out (like a ticket line)."],
  [["big o", "complexity"], "Big-O describes how running time grows with input size. O(1) is constant, O(log n) grows slowly, O(n) grows in step with n, and O(n²) grows fast."],
  [["overfit"], "Overfitting means a model memorises its training data and then does badly on new data. More data, simpler models and a validation set help."],
  [["mean", "median", "average", "variance", "deviation"], "Mean is the sum divided by the count. Median is the middle value when sorted. Variance is the average squared distance from the mean, and standard deviation is its square root."],
  [["binary", "hex", "bit"], "Binary uses only 0 and 1, and each hex digit equals 4 bits. In code, n & 1 checks the lowest bit and n >> 1 shifts the bits right."],
  [["run test", "run code", "how to run"], "Write your function in the editor (keep the name solve), then press Run tests. Each row shows what your function returned and what was expected."],
  [["avatar"], "Open your profile and choose Customise avatar to change how your doodle buddy looks."],
];

export function answer(q, deptId) {
  const s = q.toLowerCase();
  const hit = kb.map(([ks, a]) => [ks.filter(k => s.includes(k)).length, a]).filter(x => x[0]).sort((x, y) => y[0] - x[0])[0];
  if (hit) return hit[1];
  const f = Object.values(formulas).flat().find(([n]) => s.includes(n.toLowerCase()));
  if (f) return `${f[0]}: ${f[1]}`;
  const d = departments.find(x => s.includes(x.code.toLowerCase()) || s.includes(x.name.toLowerCase())) || departments.find(x => x.id === deptId);
  if (d) return `I can help with ${d.name} topics like ${d.topics.join(", ")}. Try asking about one of them, for example a formula or a concept.`;
  return "I am a simple helper in this prototype. Try asking about a formula or concept, like Ohm's law, binary search or beam moment.";
}
