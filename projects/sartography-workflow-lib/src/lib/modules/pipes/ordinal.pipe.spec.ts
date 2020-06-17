import { OrdinalPipe } from './ordinal.pipe';

describe('OrdinalPipe', () => {
  const pipe = new OrdinalPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return number as ordinal string', () => {
    expect(pipe.transform(1)).toEqual('1st');
    expect(pipe.transform(2)).toEqual('2nd');
    expect(pipe.transform(3)).toEqual('3rd');
    expect(pipe.transform(4)).toEqual('4th');
    expect(pipe.transform(10)).toEqual('10th');
    expect(pipe.transform(11)).toEqual('11th');
    expect(pipe.transform(12)).toEqual('12th');
    expect(pipe.transform(13)).toEqual('13th');
    expect(pipe.transform(14)).toEqual('14th');
    expect(pipe.transform(20)).toEqual('20th');
    expect(pipe.transform(21)).toEqual('21st');
    expect(pipe.transform(22)).toEqual('22nd');
    expect(pipe.transform(23)).toEqual('23rd');
    expect(pipe.transform(24)).toEqual('24th');
    expect(pipe.transform(101)).toEqual('101st');
    expect(pipe.transform(102)).toEqual('102nd');
    expect(pipe.transform(103)).toEqual('103rd');
    expect(pipe.transform(104)).toEqual('104th');
  });
});
