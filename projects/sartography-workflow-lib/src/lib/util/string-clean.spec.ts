import {CameltoSnakeCase, cleanUpFilename, snakeToSpace, toSnakeCase, trimString} from './string-clean';

describe('String Cleaning Utilities', () => {
  const afterTrimming = `I'm tired of wasting letters when punctuation will do, period. -Steve Martin`;
  const beforeTrimming = ` 📌📍🏁  <>?:"{}[] ${afterTrimming} !@#$%^& ✌️👍👆 `;

  it('converts a string to snake case', () => {
    expect(toSnakeCase(beforeTrimming)).toEqual('i_m_tired_of_wasting_letters_when_punctuation_will_do_period_steve_martin');
  });

  it('converts a CamelCase function to snake case', () => {
    expect(CameltoSnakeCase('genericFunctionDefinition')).toEqual('generic_function_definition');
  });

  it('cleans up a file name and replaces or adds the extension', () => {
    expect(cleanUpFilename(beforeTrimming, 'bpmn')).toEqual(`I'm tired of wasting letters when punctuation will do, period.bpmn`);
    expect(cleanUpFilename(' no extension ', 'bpmn')).toEqual('no extension.bpmn');
  });

  it('trims non-word characters from a string', () => {
    expect(trimString(beforeTrimming)).toEqual(afterTrimming);
  });

  it('replaces non-alphanumeric characters in a string with spaces', () => {
    expect(snakeToSpace('unreadable-Error_CODE-400')).toEqual('unreadable error code 400');
  });

});
