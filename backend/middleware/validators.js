/**
 * Small, dependency-free validation helpers shared by the controllers.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

function isValidPlayerPayload({ name, email, employeeId, plant }) {
  const errors = [];
  if (!isNonEmptyString(name)) errors.push("Name is required.");
  if (!isValidEmail(email)) errors.push("A valid email address is required.");
  if (!isNonEmptyString(employeeId)) errors.push("Employee ID is required.");
  if (!isNonEmptyString(plant)) errors.push("Plant selection is required.");
  return errors;
}

module.exports = { isNonEmptyString, isValidEmail, isValidPlayerPayload };
