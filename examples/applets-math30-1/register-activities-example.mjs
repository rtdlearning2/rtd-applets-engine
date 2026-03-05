// examples/applets-math30-1/register-activities-example.mjs
// Example showing how an external content repo can register a custom activity
// at runtime with the engine. In a real content repo, install `applets-engine`
// as a dependency and import `registerActivity` from its activities entrypoint.

// ESM example (preferred):
// import { registerActivity } from 'applets-engine/engine/activityRegistry.js';
// import * as myActivity from './my-custom-activity.js';
// registerActivity(myActivity);

// CommonJS example (Node):
// const { registerActivity } = require('applets-engine/engine/activityRegistry.js');
// const myActivity = require('./my-custom-activity.js');
// registerActivity(myActivity);

// Minimal inline activity example for demonstration:
export const myActivity = {
  activityType: 'myCustom',
  createActivityState(config, src) {
    return { expectedPoints: [], studentPoints: [] };
  },
  getInteractionHandlers() {
    return {
      placePoints: (state, e, svg, onStateChange) => {
        // custom handler logic
      }
    };
  }
};

// If you installed applets-engine as a dependency you could register like:
// import { registerActivity } from 'applets-engine/engine/activityRegistry.js';
// registerActivity(myActivity);

console.log('Example registration file — copy the pattern into your content repo to register activities at runtime.');
