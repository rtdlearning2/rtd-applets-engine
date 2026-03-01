export const renderPageFeedback = (pageState) => {
  if (!pageState?.submitted) return "";
  const klass = pageState.isCorrect ? "success" : "error";
  const text = pageState.feedback ?? (pageState.isCorrect ? "Correct." : "Not correct. Try again.");
  return `<div class="page-feedback ${klass}">${text}</div>`;
};

export const setSubmitFeedback = (pageState, isCorrect, message) => {
  pageState.submitted = true;
  pageState.isCorrect = Boolean(isCorrect);
  pageState.feedback = message ?? (pageState.isCorrect ? "Correct." : "Not correct. Try again.");
};
