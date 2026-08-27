/* eslint-disable no-unused-vars */

/**
 * Centralized error handler. Controllers call next(err) on unexpected
 * failures; validation failures are handled inline with a direct
 * res.status(400) response so the client gets a clear message.
 */
function errorHandler(err, req, res, next) {
  console.error("❌ Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server.",
  });
}

module.exports = errorHandler;
