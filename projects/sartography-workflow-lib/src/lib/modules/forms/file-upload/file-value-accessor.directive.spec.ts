import { FileValueAccessorDirective } from './file-value-accessor.directive';

describe('FileValueAccessorDirective', () => {
  it('should create an instance', () => {
    const directive = new FileValueAccessorDirective();
    expect(directive).toBeTruthy();
  });

  it('should register onChange function', () => {
    const directive = new FileValueAccessorDirective();
    directive.registerOnChange('blort');
    expect(directive.onChange).toEqual('blort');
  });

  it('should register onTouched function', () => {
    const directive = new FileValueAccessorDirective();
    directive.registerOnTouched('blort');
    expect(directive.onTouched).toEqual('blort');
  });
});
