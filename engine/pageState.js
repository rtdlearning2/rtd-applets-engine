export const getPageState = (state, pageId, initFn) => {
  if (!state.pageState) state.pageState = {};
  if (!state.pageState[pageId]) {
    state.pageState[pageId] = initFn ? initFn() : {};
  }
  return state.pageState[pageId];
};
