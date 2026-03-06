import { test } from "node:test";
import assert from "node:assert/strict";
import { orderStudentPoints } from "../engine/utils/validator.js";
import { computeExpectedPoints } from "../engine/utils/transformEngine.js";

// --- orderStudentPoints ---

test("orderStudentPoints: exact matches returned in expected order", () => {
  const expected = [[1, 2], [3, 4], [5, 6]];
  const student = [[5, 6], [1, 2], [3, 4]];
  const result = orderStudentPoints(expected, student);
  assert.deepEqual(result, [[1, 2], [3, 4], [5, 6]]);
});

test("orderStudentPoints: missing student points are omitted", () => {
  const expected = [[1, 2], [3, 4], [5, 6]];
  const student = [[1, 2], [5, 6]];
  const result = orderStudentPoints(expected, student);
  assert.deepEqual(result, [[1, 2], [5, 6]]);
});

test("orderStudentPoints: empty student returns empty", () => {
  const result = orderStudentPoints([[1, 2], [3, 4]], []);
  assert.deepEqual(result, []);
});

test("orderStudentPoints: tolerance allows near matches", () => {
  const expected = [[2, 3]];
  const student = [[2.3, 3.3]];
  const result = orderStudentPoints(expected, student, 0.5);
  assert.deepEqual(result, [[2.3, 3.3]]);
});

test("orderStudentPoints: point outside tolerance is excluded", () => {
  const expected = [[2, 3]];
  const student = [[2.6, 3.6]];
  const result = orderStudentPoints(expected, student, 0.5);
  assert.deepEqual(result, []);
});

// --- computeExpectedPoints ---

test("computeExpectedPoints: reflect_x negates y", () => {
  const pts = [[1, 2], [-3, 4]];
  const result = computeExpectedPoints(pts, { type: "reflect_x" });
  assert.deepEqual(result, [[1, -2], [-3, -4]]);
});

test("computeExpectedPoints: reflect_y negates x", () => {
  const pts = [[1, 2], [-3, 4]];
  const result = computeExpectedPoints(pts, { type: "reflect_y" });
  assert.deepEqual(result, [[-1, 2], [3, 4]]);
});

test("computeExpectedPoints: translate shifts by dx/dy", () => {
  const pts = [[0, 0], [1, 1]];
  const result = computeExpectedPoints(pts, { type: "translate", dx: 3, dy: -2 });
  assert.deepEqual(result, [[3, -2], [4, -1]]);
});

test("computeExpectedPoints: rotate 90 around origin", () => {
  const pts = [[1, 0], [0, 1]];
  const result = computeExpectedPoints(pts, { type: "rotate", angle: 90 });
  assert.deepEqual(result, [[0, 1], [-1, 0]]);
});

test("computeExpectedPoints: rotate 180 around origin", () => {
  const pts = [[2, 3]];
  const result = computeExpectedPoints(pts, { type: "rotate", angle: 180 });
  assert.deepEqual(result, [[-2, -3]]);
});

test("computeExpectedPoints: dilate scale by 2 from origin", () => {
  const pts = [[1, 2], [-1, 3]];
  const result = computeExpectedPoints(pts, { type: "dilate", k: 2 });
  assert.deepEqual(result, [[2, 4], [-2, 6]]);
});

test("computeExpectedPoints: no transform returns original", () => {
  const pts = [[1, 2], [3, 4]];
  const result = computeExpectedPoints(pts, null);
  assert.deepEqual(result, pts);
});

test("computeExpectedPoints: empty points returns empty", () => {
  const result = computeExpectedPoints([], { type: "reflect_x" });
  assert.deepEqual(result, []);
});
