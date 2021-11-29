export function trimString(input: string) {
  return input.trim();
}

// checks for empty string
export function isEmptyString(input: string) {
  return trimString(input) === "";
}
