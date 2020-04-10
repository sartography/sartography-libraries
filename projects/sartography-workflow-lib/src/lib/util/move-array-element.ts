/**
 * Given the array `a`, moves element with index `i` one position up.
 * Mutates the given array. Does nothing if `i` is an invalid index.
 */
export const moveArrayElementUp = (a: Array<any>, i: number) => {
  if (i === 0) {
    return;
  } else {
    swapArrayElements(a, i, i - 1);
  }
}

/**
 * Given the array `a`, moves element with index `i` one position down.
 * Mutates the given array. Does nothing if `i` is an invalid index.
 */
export const moveArrayElementDown = (a: Array<any>, i: number) => {
  if (i === a.length - 1) {
    return;
  } else {
    swapArrayElements(a, i, i + 1);
  }
}

/**
 * Given the array `a`, swaps the positions of elements with indexes `i` and `j`,
 * mutating the given array. Does nothing if `i` or `j` are invalid indexes.
 */
export const swapArrayElements = (a: Array<any>, i: number, j: number) => {
  if (i >= 0 && j >= 0 && (a.length >= i + 1) && (a.length >= j + 1)) {
    [a[i], a[j]] = [a[j], a[i]]; // Swap items using destructuring
  }
}
