// src/utils/prayerValidation.js

export const DATE_REGEX =/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;        
export const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // 00:00–23:59

export function validateTimeOrNullFrontend(value, fieldName, errors) {
  if (value == null || value === "") return null;

  if (typeof value !== "string") {
    errors.push(`Invalid type for ${fieldName}, expected string`);
    return null;
  }

  const trimmed = value.trim();
  if (!TIME_REGEX.test(trimmed)) {
    errors.push(`Invalid time format for ${fieldName} (expected HH:MM)`);
    return null;
  }

  return trimmed;
}

/**
 * Validate a single editForm entry:
 * {
 *   date: "2025-04-01",
 *   fajr: "05:16",
 *   sunrise: "06:54",
 *   ...
 * }
 */
export function changeDate(date) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
}
export function validatePrayerForm(editForm) {
  const errors = [];
  // Date required
  if (!editForm.date) {
    errors.push("Date is required");
  } else {
    editForm.date = changeDate(editForm.date);
    if (!DATE_REGEX.test(editForm.date)){
      errors.push("Date must be in format YYYY-MM-DD");
    }
  }

  // Times: optional, but if given must be HH:MM
  const cleaned = {
    date: editForm.date,
    fajr: validateTimeOrNullFrontend(editForm.fajr, "fajr", errors),
    sunrise: validateTimeOrNullFrontend(editForm.sunrise, "sunrise", errors),
    dhuhr: validateTimeOrNullFrontend(editForm.dhuhr, "dhuhr", errors),
    asr: validateTimeOrNullFrontend(editForm.asr, "asr", errors),
    maghrib: validateTimeOrNullFrontend(editForm.maghrib, "maghrib", errors),
    isha: validateTimeOrNullFrontend(editForm.isha, "isha", errors),
  };

  return { errors, cleaned };
}
