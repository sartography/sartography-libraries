import { UnescapeLineBreaksPipe } from './unescape-line-breaks.pipe';

describe('UnescapeLineBreaksPipe', () => {
  const pipe = new UnescapeLineBreaksPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert escaped line breaks', () => {
    expect(pipe.transform('Un\\nescape\\r\\nme\nplease!')).toEqual('Un\nescape\nme\nplease!');
    expect(pipe.transform('Un\\r\\nescape\\r\\nme\\r\\nplease!')).toEqual('Un\nescape\nme\nplease!');
    expect(pipe.transform('But\nleave\nme\nalone.')).toEqual('But\nleave\nme\nalone.');
  });
});
