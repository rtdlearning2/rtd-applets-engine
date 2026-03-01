const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export const validateLegacyConfig = (config) => {
  const errors = [];

  if (!isObject(config)) {
    return ["config must be an object"];
  }

  const originalPoints = config?.original?.points;
  const series = config?.series;
  if (!Array.isArray(originalPoints) && !Array.isArray(series)) {
    errors.push("missing original.points or series array");
  }

  const grid = config?.grid ?? config?.view;
  if (!isObject(grid)) {
    errors.push("missing grid/view settings");
  } else {
    ["xmin", "xmax", "ymin", "ymax"].forEach(key => {
      if (grid[key] === undefined) {
        errors.push(`grid/view missing ${key}`);
      }
    });
  }

  if (!isObject(config?.interaction)) {
    errors.push("missing interaction settings");
  }

  return errors;
};
