const { default: BigNumber } = require("bignumber.js")
// import MoneyInput from "./MoneyInput"

class Money {
  constructor(money, currency = "TRY") {
    if (money instanceof Money) {
      this.amount = new BigNumber(money.getAmount());
      this.currency = money.getCurrency();
    } else if (money.amount && money.currency) {
      this.amount = new BigNumber(money.amount)
      if (this.amount.isNaN()) {
        this.amount = undefined;
        this.currency = undefined;
        this.symbol = undefined;
        throw new Error("Money constructor recieved NaN value.");
      }
      this.currency = money.currency;
    }
    
    else {
      this.amount = new BigNumber(money);
      if (this.amount.isNaN()) {
        this.amount = undefined;
        this.currency = undefined;
        this.symbol = undefined;
        throw new Error("Money constructor recieved NaN value.");
      }
      this.currency = currency;
    }

    this.symbol = ""
    switch (money.currency || currency) {
      case "USD":
        this.symbol = "$"
        break
      case "EUR":
        this.symbol = "€"
        break
      case "TRY":
        this.symbol = "₺"
        break
      case "GBP":
        this.symbol = "£"
        break
      default:
        this.symbol = this.currency
    }
  }

  getAmount() {
    return this.amount.toString()
  }

  getNumberAmount() {
    return this.amount.toNumber()
  }

  getCurrency() {
    return this.currency
  }

  getSymbol() {
    return this.symbol
  }

  isSameCurrency(money) {
    return this.currency === money.currency
  }

  isZero() {
    return this.amount.isZero()
  }

  isNegative() {
    return this.amount.isNegative()
  }

  isPositive() {
    return this.amount.isPositive()
  }

  static isValidMoney(m) {
    if (m instanceof Money) {
      return !(m.amount.isNaN());
    }
    if (m.amount && m.currency) {
      let bn = new BigNumber(m.amount);
      return !(bn.isNaN());
    }
    return false;
  }

  add(money) {
    if (!Money.isValidMoney(money)) {
      throw new Error("Add parameter is not a valid Money!")
    }
    if (!this.isSameCurrency(money)) {
      throw new Error("You are trying to add two different currencies")
    }

    const amount = this.amount.plus(money.amount).decimalPlaces(2)
    return new Money(amount, this.currency)
  }

  substract(money) {
    if (!Money.isValidMoney(money)) {
      throw new Error("Subtact parameter is not a valid Money!")
    }
    if (!this.isSameCurrency(money)) {
      throw new Error("You are trying to subtract two different currencies")
    }

    const amount = this.amount.minus(money.amount).decimalPlaces(2)
    return new Money(amount, this.currency)
  }

  compare(money) {
    if (!Money.isValidMoney(money)) {
      throw new Error("Compare parameter is not a valid Money!")
    }
    if (!this.isSameCurrency(money)) {
      throw new Error("Cannot compare different currencies")
    }

    if (this.amount.isEqualTo(money.amount)) return 0
    else if (this.amount.isLessThan(money.amount)) return -1
    else if (this.amount.isGreaterThan(money.amount)) return 1
  }

  getPercentage(percAmount) {
    let thisAmount = new BigNumber(this.amount)
    return new Money(
      thisAmount.multipliedBy(percAmount).dividedBy("100").decimalPlaces(2),
      this.currency
    )
  }

  applyDiscount(percAmount) {
    const discount = this.amount.multipliedBy(percAmount).dividedBy("100")
    const amount = this.amount.minus(discount).decimalPlaces(2)

    return new Money(amount, this.currency)
  }

  applyRise(percAmount) {
    const rise = this.amount.multipliedBy(percAmount).dividedBy("100")
    const amount = this.amount.plus(rise).decimalPlaces(2)

    return new Money(amount, this.currency)
  }

  negated() {
    return new Money(this.amount.negated(), this.currency)
  }

  percentageOf(money) {
    let thisAmount = new BigNumber(this.amount)
    let paramAmount = new BigNumber(money.getAmount())

    thisAmount = thisAmount.multipliedBy("100").dividedBy(paramAmount)

    return thisAmount.decimalPlaces(3).toString()
  }

  toDisplay() {
    return `${this.amount.toString().replace(".", ",")} ${this.symbol}`
  }

  toJSON() {
    return { amount: this.amount.toString(), currency: this.currency }
  }
}
// export default Money
// export { MoneyInput }

module.exports = Money