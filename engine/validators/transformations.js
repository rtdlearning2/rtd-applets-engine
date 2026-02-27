export function validate(state) {
  const expected = state.expectedPoints ?? [];
  const student = state.studentPoints ?? [];

  if (student.length !== expected.length) {
    return {
      isCorrect: false,
      details: {
        message: `You must plot exactly ${expected.length} points.`
      }
    };
  }

  const tolerance = 0; // later upgradeable

  function pointsMatch(p1, p2) {
    return (
      Math.abs(p1[0] - p2[0]) <= tolerance &&
      Math.abs(p1[1] - p2[1]) <= tolerance
    );
  }

  const unmatchedStudent = [...student];

  for (let exp of expected) {
    const index = unmatchedStudent.findIndex(stu => pointsMatch(exp, stu));
    if (index === -1) {
      return {
        isCorrect: false,
        details: {
          message: "That graph is not correct. Try again."
        }
      };
    }
    unmatchedStudent.splice(index, 1);
  }

  return {
    isCorrect: true,
    details: {
      message: "Correct! The transformation is accurate."
    }
  };
}
