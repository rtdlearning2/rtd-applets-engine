// examples/applets-math30-1/register-transformations.mjs
// This module demonstrates how a content repo can register a transformations
// activity at runtime with the engine's registry. Place this file at the
// path /examples/applets-math30-1/register-transformations.mjs so the engine
// can import it dynamically before creating app state.

import { registerActivity } from '/engine/activities/index.js';
import * as transformations from './activities/transformations.js';

registerActivity(transformations);

console.log('Registered content-hosted transformations activity.');
