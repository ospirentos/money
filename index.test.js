const Money = require("./index")

test("invalid constructor input throws an error", () => {
    expect(() => new Money("asasdasd")).toThrow(Error)
})

test("constructor from Money instance", () => {
  let m1 = new Money(12, "TRY");
  expect(new Money(m1).getAmount()).toBe("12");
  expect(new Money(m1).getNumberAmount()).toBe(12)
  expect(new Money(m1).getCurrency()).toBe("TRY");
})

test("constructor from Money JSON", () => {
  expect(() => new Money({amount: "asdsad", currency: "TRY"})).toThrow(Error);
  expect(new Money({amount: 12, currency: "TRY"}).getAmount()).toBe("12");
  expect(new Money({amount: 12, currency: "TRY"}).getNumberAmount()).toBe(12);
  expect(new Money({amount: 12, currency: "TRY"}).getCurrency()).toBe("TRY");
})

test("constructor from normal variables", () => {
  expect(() => new Money("asdasd", "TRY")).toThrow(Error);
  expect(new Money(36, "TRY").getAmount()).toBe("36");
  expect(new Money(36, "TRY").getNumberAmount()).toBe(36);
  expect(new Money(36, "TRY").getCurrency()).toBe("TRY");
})

test ("constructor with just a single amount variable", () => {
  expect(new Money(48).getAmount()).toBe("48");
  expect(new Money(48).getNumberAmount()).toBe(48);
  expect(new Money(48).getCurrency()).toBe("TRY");
})

test("Correct symbol test", () => {
  expect(new Money({amount: 12, currency: "TRY"}).getSymbol()).toBe("₺");
  expect(new Money({amount: 12, currency: "USD"}).getSymbol()).toBe("$");
  expect(new Money({amount: 12, currency: "GBP"}).getSymbol()).toBe("£");
  expect(new Money({amount: 12, currency: "EUR"}).getSymbol()).toBe("€");
  expect(new Money({amount: 12, currency: "NOK"}).getSymbol()).toBe("NOK");
  expect(new Money({amount: 12, currency: "AUD"}).getSymbol()).toBe("AUD");
})

test("is same currency", () => {
  let m1 = new Money(15, "TRY");
  let m2 = new Money(15, "USD");
  let m3 = new Money(15, "TRY");
  expect(m1.isSameCurrency(m2)).toBe(false);
  expect(m1.isSameCurrency(m3)).toBe(true);
})

test("isZero()", () => {
  expect(new Money(0).isZero()).toBe(true);
  expect(new Money(15).isZero()).toBe(false);
  expect(new Money(-15).isZero()).toBe(false);
})

test("isNegative()", () => {
  expect(new Money(0).isNegative()).toBe(false);
  expect(new Money(-0).isNegative()).toBe(true);
  expect(new Money(-1).isNegative()).toBe(true);
  expect(new Money(1).isNegative()).toBe(false);
})

test("isPositive()", () => {
  expect(new Money(0).isPositive()).toBe(true);
  expect(new Money(-0).isPositive()).toBe(false);
  expect(new Money(-1).isPositive()).toBe(false);
  expect(new Money(1).isPositive()).toBe(true);
})

test("isValidMoney", () => {
  expect(Money.isValidMoney(new Money(12, "TRY"))).toBe(true);
  expect(Money.isValidMoney({value: 12, currency: "TRY"})).toBe(false);
  expect(Money.isValidMoney({amount: 12, type: "TRY"})).toBe(false);
  expect(Money.isValidMoney({amount: 12, currency: "TRY"})).toBe(true);
  expect(Money.isValidMoney({amount: "asdasd", currency: "TRY"})).toBe(false);
})

test("adding two moneys", () => {
  let m1 = new Money(15, "TRY");
  let m2 = new Money(13, "TRY");
  let m3 = new Money(10, "USD");
  let m4 = {amount: 18, currency: "TRY"};
  expect(m1.add(m2).toJSON()).toStrictEqual({amount: "28", currency: "TRY"});
  expect(() => m1.add(m3)).toThrow("You are trying to add two different currencies");
  expect(m1.add(m4).toJSON()).toStrictEqual({amount: "33", currency: "TRY"});
  expect(() => m2.add({type: 18, currency: "TRY"})).toThrow("Add parameter is not a valid Money!");
})

test("subtracting two moneys", () => {
  let m1 = new Money(15, "TRY");
  let m2 = new Money(13, "TRY");
  let m3 = new Money(10, "USD");
  let m4 = {amount: 18, currency: "TRY"};
  expect(m1.substract(m2).toJSON()).toStrictEqual({amount: "2", currency: "TRY"});
  expect(() => m1.substract(m3)).toThrow("You are trying to subtract two different currencies");
  expect(m1.substract(m4).toJSON()).toStrictEqual({amount: "-3", currency: "TRY"});
  expect(() => m2.substract({type: 18, currency: "TRY"})).toThrow("Subtact parameter is not a valid Money!");
})

test("compare()", () => {
  let m1 = new Money(15, "TRY");
  let m2 = new Money(13, "TRY");
  let m3 = new Money(10, "USD");
  let m4 = {amount: 18, currency: "TRY"};
  let m5 = new Money(13, "TRY");
  let m6 = {amount: -19, currency: "TRY"};
  expect(m1.compare(m2)).toBe(1);
  expect(m2.compare(m6)).toBe(1);
  expect(() => m1.compare(m3)).toThrow("Cannot compare different currencies");
  expect(m1.compare(m4)).toBe(-1);
  expect(m2.compare(m5)).toBe(0);
  expect(() => m2.compare({type: 18, currency: "TRY"})).toThrow("Compare parameter is not a valid Money!");
})

test("getPercentage()", () => {
  let m1 = new Money(100, "TRY");
  let m2 = new Money(100, "USD");
  expect(m1.getPercentage(25).toJSON()).toStrictEqual({amount: "25", currency:"TRY"})
  expect(m2.getPercentage(25).toJSON()).toStrictEqual({amount: "25", currency:"USD"})
})

test("applyDiscount() and Rise", () => {
  let m1 = new Money(100, "TRY");
  expect(m1.applyDiscount(25).toJSON()).toStrictEqual({amount: "75", currency:"TRY"})
  expect(m1.applyRise(25).toJSON()).toStrictEqual({amount: "125", currency:"TRY"})
})

test("negate", () => {
  let m1 = new Money("13", "TRY");
  let m2 = new Money("-13", "TRY");
  expect(m1.negated().toJSON()).toStrictEqual({amount: "-13", currency: "TRY"})
  expect(m2.negated().toJSON()).toStrictEqual({amount: "13", currency: "TRY"})
})

test("percentage of", () => {
  let m1 = new Money(25, "TRY");
  let m2 = new Money(100, "TRY");
  expect(m1.percentageOf(m2)).toBe("25")
  expect(m2.percentageOf(m1)).toBe("400")
})

test("toDisplay()", () => {
  let m1 = new Money(36, "TRY");
  let m2 = new Money(36, "USD");
  let m3 = new Money(36, "EUR");
  let m4 = new Money(36, "GBP");
  expect(m1.toDisplay()).toStrictEqual("36 ₺")
  expect(m2.toDisplay()).toStrictEqual("36 $")
  expect(m3.toDisplay()).toStrictEqual("36 €")
  expect(m4.toDisplay()).toStrictEqual("36 £")
})

test("toJSON", () => {
  let m1  = new Money(16, "TRY");
  expect(m1.toJSON()).toStrictEqual({amount: "16", currency: "TRY" })
})