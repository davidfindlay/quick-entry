import { TimePipe } from './time.pipe';

describe('TimePipe', () => {
  it('create an instance', () => {
    const pipe = new TimePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return NT if time is zero', () => {
    const pipe = new TimePipe();
    const result: string = pipe.transform(0);
    expect(result).toBe('NT');
  });

  it('should return a valid value for seconds only time', () => {
    const pipe = new TimePipe();
    const result: string = pipe.transform(35.42);
    expect(result).toBe('35.42');
  });

  it('should return a valid value for minutes and seconds time', () => {
    const pipe = new TimePipe();
    const result: string = pipe.transform(92.1);
    expect(result).toBe('1:32.10');
  });

  it('should return a leading zero if the seconds part is below 10', () => {
    const pipe = new TimePipe();
    const result: string = pipe.transform(62.05);
    expect(result).toBe('1:02.05');
  });

  it('should return a valid value for less than 10 seconds', () => {
    const pipe = new TimePipe();
    const result: string = pipe.transform(9.1);
    expect(result).toBe('9.10');
  });

});
