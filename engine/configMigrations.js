const DEFAULT_SCHEMA_VERSION = "0";
const DEFAULT_VIEW = { xmin: -10, xmax: 10, ymin: -10, ymax: 10 };
const DEFAULT_UI = {
  title: "",
  subtitle: "",
  instructions: "",
  legend: []
};
const DEFAULT_INTERACTION = {
  mode: "placePoints",
  snapStep: 1,
  hitRadiusPx: 12
};

export function migrateConfig(rawConfig = {}) {
  const schemaVersion = `${rawConfig?.schemaVersion ?? DEFAULT_SCHEMA_VERSION}`;

  if (schemaVersion === "1") {
    return migrateSchemaOne(rawConfig);
  }

  return {
    ...rawConfig,
    schemaVersion
  };
}

function migrateSchemaOne(rawConfig) {
  const view = normalizeView(rawConfig);
  const ui = normalizeUi(rawConfig);
  const interaction = normalizeInteraction(rawConfig);
  const series = normalizeSeries(rawConfig);
  const activity = normalizeActivity(rawConfig);
  const activityType = activity.type ?? rawConfig.activityType ?? "transformations";
  const original = normalizeOriginal(rawConfig, series);
  const transform = rawConfig.transform ?? activity.transform;

  return {
    ...rawConfig,
    schemaVersion: "1",
    view,
    ui,
    interaction,
    series,
    activity,
    grid: view,
    title: ui.title,
    subtitle: ui.subtitle,
    instructions: ui.instructions,
    legend: ui.legend,
    original,
    transform,
    activityType
  };
}

function normalizeView(rawConfig) {
  const source = rawConfig.view ?? rawConfig.grid ?? DEFAULT_VIEW;
  return {
    xmin: toNumber(source.xmin, DEFAULT_VIEW.xmin),
    xmax: toNumber(source.xmax, DEFAULT_VIEW.xmax),
    ymin: toNumber(source.ymin, DEFAULT_VIEW.ymin),
    ymax: toNumber(source.ymax, DEFAULT_VIEW.ymax)
  };
}

function normalizeUi(rawConfig) {
  const source = isObject(rawConfig.ui) ? rawConfig.ui : {};
  return {
    title: source.title ?? rawConfig.title ?? DEFAULT_UI.title,
    subtitle: source.subtitle ?? rawConfig.subtitle ?? DEFAULT_UI.subtitle,
    instructions: source.instructions ?? rawConfig.instructions ?? DEFAULT_UI.instructions,
    legend: source.legend ?? rawConfig.legend ?? DEFAULT_UI.legend
  };
}

function normalizeInteraction(rawConfig) {
  const source = isObject(rawConfig.interaction) ? rawConfig.interaction : {};
  return {
    mode: source.mode ?? DEFAULT_INTERACTION.mode,
    snapStep: toNumber(source.snapStep, DEFAULT_INTERACTION.snapStep),
    hitRadiusPx: toNumber(source.hitRadiusPx, DEFAULT_INTERACTION.hitRadiusPx)
  };
}

function normalizeSeries(rawConfig) {
  if (Array.isArray(rawConfig.series)) {
    return rawConfig.series;
  }
  if (rawConfig.original?.points) {
    return [
      {
        id: "original",
        role: "original",
        points: rawConfig.original.points
      }
    ];
  }
  return [];
}

function normalizeActivity(rawConfig) {
  const source = isObject(rawConfig.activity) ? rawConfig.activity : {};
  const type = source.type ?? rawConfig.activityType ?? "transformations";
  return {
    ...source,
    type
  };
}

function normalizeOriginal(rawConfig, series) {
  if (rawConfig.original?.points) {
    return rawConfig.original;
  }

  const candidate = findOriginalSeries(series);
  const points = extractSeriesPoints(candidate);

  if (Array.isArray(points)) {
    return { points };
  }

  return { points: [] };
}

function findOriginalSeries(series) {
  if (!Array.isArray(series)) return null;

  const preferredRoles = ["original", "reference", "base"];
  for (const role of preferredRoles) {
    const match = series.find(entry => entry?.role === role || entry?.id === role);
    if (match) return match;
  }

  return series[0] ?? null;
}

function extractSeriesPoints(entry) {
  if (!entry) return null;
  if (Array.isArray(entry.points)) return entry.points;
  if (Array.isArray(entry.geometry?.points)) return entry.geometry.points;
  if (Array.isArray(entry.data?.points)) return entry.data.points;
  return null;
}

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
