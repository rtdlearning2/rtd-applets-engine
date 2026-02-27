// engine/validator.js
console.log("validator.js loaded v1");

export function orderStudentPoints(expectedPoints, studentPoints, tolerance = 0) {
  function matches(p1, p2) {
    return (
      Math.abs(p1[0] - p2[0]) <= tolerance &&
      Math.abs(p1[1] - p2[1]) <= tolerance
    );
  }

  // For each expected vertex (in order), include it if the student has that point.
  const ordered = [];
  for (const exp of expectedPoints) {
    const found = studentPoints.find(stu => matches(exp, stu));
    if (found) ordered.push(found);
  }
  return ordered;
}
