// implementation of this: https://stackoverflow.com/a/11691651

/**
 * generateQueryList
 * Returns elements as a string[] vs a string to allow for greater flexibility
 * @param {number} listLength - the length of the list of arguments that will be passed in as query parameters to a client.query call
 * @return {string} - returns a string[] in the form ["$1", "$2",..., "$n"] where n is the length of the input listLength. If a listLength of 0 is provided, returns an empty array
 */
export function generateQueryList(listLength: number): string[] {
  if (listLength === 0) return [];

  const params = [];

  for (let i = 1; i <= listLength; i++) {
    params.push(`$${i}`);
  }

  return params;
}
