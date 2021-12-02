export function trimString(input: string) {
  return input.trim();
}

// checks for empty string
export function isEmptyString(input: string) {
  return trimString(input) === "";
}

export function normalizeString(input: string): string | undefined {
  if (!input) return;

  return input.toLowerCase().trim();
}

export function containsDuplicates(
  inputStr: string,
  strList: string[]
): boolean {
  const normalizedStr = normalizeString(inputStr);

  if (normalizeString) {
    return strList.some((strEl) => {
      return normalizeString(strEl) === normalizedStr;
    });
  }
  return false;
}
