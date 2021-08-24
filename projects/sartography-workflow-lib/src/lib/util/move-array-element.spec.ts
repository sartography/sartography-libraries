import {swapArrayElements, moveArrayElementDown, moveArrayElementUp} from './move-array-element';

describe('moveArrayElementTo', () => {
  it('should move an array item to the destination index', () => {
    const arrayBefore = ['a', 'b', 'c', 'd'];
    const arrayAfter = ['d', 'b', 'c', 'a'];
    swapArrayElements(arrayBefore, 0, 3);
    expect(arrayBefore).toEqual(arrayAfter);
  });

  it('should do nothing if one of the given indexes is invalid', () => {
    const arrayBefore = ['a', 'b', 'c', 'd'];
    const arrayUnchanged = ['a', 'b', 'c', 'd'];
    swapArrayElements(arrayBefore, -1, 3);
    swapArrayElements(arrayBefore, 0, 4);
    expect(arrayBefore).toEqual(arrayUnchanged);
  });
});

describe('moveArrayElementUp', () => {
  it('should move an array item up', () => {
    const arrayBefore = ['a', 'b', 'c', 'd'];
    const arrayAfter = ['a', 'c', 'b', 'd'];
    moveArrayElementUp(arrayBefore, 2);
    expect(arrayBefore).toEqual(arrayAfter);
  });

  it('should do nothing if the array item is already first', () => {
    const arrayBefore = ['a', 'b', 'c', 'd'];
    const arrayUnchanged = ['a', 'b', 'c', 'd'];
    moveArrayElementUp(arrayBefore, 0);
    expect(arrayBefore).toEqual(arrayUnchanged);
  });
});

describe('moveArrayElementDown', () => {
  it('should move an array item down', () => {
    const arrayBefore = ['a', 'b', 'c', 'd'];
    const arrayAfter = ['a', 'c', 'b', 'd'];
    moveArrayElementDown(arrayBefore, 1);
    expect(arrayBefore).toEqual(arrayAfter);
  });

  it('should do nothing if the array item is already last', () => {
    const arrayBefore = ['a', 'b', 'c', 'd'];
    const arrayUnchanged = ['a', 'b', 'c', 'd'];
    moveArrayElementDown(arrayBefore, 3);
    expect(arrayBefore).toEqual(arrayUnchanged);
  });
});
