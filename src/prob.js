'use strict';

/**
 * Holds the set error handling callback
 * @type {Function}
 */
let handler = null;

/**
 * Severity levels mapping (npm levels)
 * @type {Object}
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

/**
 * Sets the handler to use
 * @param {Function} callback Will callback a Prob object if thrown
 */
function setHandler(callback) {
  handler = callback;
}

/**
 * Error handling middleware. Will catch all errors, handle errors of Prob type
 * while rethrowing all other errors.
 * @param  {Context}  ctx  Koa context
 * @param  {Function} next Next middleware
 */
async function handle(ctx, next) {
  let error;

  try {
    await next();
    return;
  } catch (err) {
    error = err;
  }

  if (error instanceof Prob) {
    handler(ctx, error);
    return;
  }

  throw error;
}

/**
 * Prob object
 * @param {string} severity One of the levels listed in 'levels'
 * @param {string} message  Human readable message of the error
 * @param {any}    data     Data related to the error
 * @param {number} status   Applicable http status for this error
 */
function Prob(severity, message, data, status = 500) {
  if (!(severity in levels)) {
    throw new TypeError('Invalid severity');
  }

  this.severity = severity;
  this.message = message;
  this.data = data;
  this.stack = (new Error()).stack;
  this.status = status;
}

module.exports = {
  setHandler,
  handle,
  Prob
};
