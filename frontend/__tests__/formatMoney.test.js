import formatMoney from '../lib/formatMoney';

describe('format Money function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(40)).toEqual('$0.40');
    expect(formatMoney(9)).toEqual('$0.09');
  });

  it('removes 00 cents when its a whole number', () => {
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(5000)).toEqual('$50');
  });
});
