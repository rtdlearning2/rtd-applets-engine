// engine/validator.js
console.log("validator.js loaded v1");

export function validateSubmission(state) {
  const student = state.studentPoints ?? [];
  const expected = state.expectedPoints ?? [];

  if (student.length !== expected.length) {
    return {
      correct: false,
      message: `You must plot exactly ${expected.length} points.`
    };
  }

  for (let i = 0; i < expected.length; i++) {
    const s = student[i];
    const e = expected[i];

    if (!s || !e || s[0] !== e[0] || s[1] !== e[1]) {
      return {
        correct: false,
        message: "That graph is not correct. Try again."
      };
    }
  }

  return {
    correct: true,
    message: "Correct! The transformation is accurate."
  };
}