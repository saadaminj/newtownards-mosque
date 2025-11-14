
const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // 00:00–23:59

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function validateTimeOrNull(value, fieldName) {
  if (value == null || value === "") return null;

  if (typeof value !== "string") {
    throw new Error(`Invalid type for ${fieldName}, expected string`);
  }

  const trimmed = value.trim();
  if (!TIME_REGEX.test(trimmed)) {
    throw new Error(`Invalid time format for ${fieldName} (expected HH:MM)`);
  }

  return trimmed;
}

module.exports = {
  isPlainObject,
  validateTimeOrNull,
};