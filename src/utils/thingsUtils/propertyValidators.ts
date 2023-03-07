/**
 * Checks if a string is a valid ISO date
 * @param str The string to check
 * @returns Returns true if the string is a valid ISO date
 */
export function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d.valueOf()) && d.toISOString() === str; // valid date
}

/**
 * Checks if a string is a valid date time string
 * @param str The string to check
 * @returns Returns true if the string is a valid date time string
 */
export function isDateTimeStr(str: string) {
  let match = str.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}@[0-9]{2}:[0-9]{2}$/);
  if (!match) return false; // not a valid date time string

  const [hour, minute] = match[0].split("@")[1].split(":").map(val => parseInt(val));
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}


export function isDateStr(str: string) { // yyyy-mm-dd
  let match = str.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
  if (!match) return false; // not a valid date string

  const [year, month, day] = match[0].split("-").map(val => parseInt(val));
  return year >= 0 && month >= 1 && month <= 12 && day >= 1 && day <= 31;
}