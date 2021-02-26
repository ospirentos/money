import React, { useState, useEffect } from "react"
import { Input, Select } from "antd"
import PropTypes from "prop-types"
import Money from "."
import _ from "underscore"

const MoneyInput = (props) => {
  const [currencySymbol, setCurrencySymbol] = useState(
    props.defaultValue ? props.defaultValue.getSymbol() : "₺"
  )
  const [selectedCurrency, setSelectedCurrency] = useState(
    props.defaultValue ? props.defaultValue.getCurrency() : "TRY"
  )
  const [value, setValue] = useState(
    props.defaultValue ? props.defaultValue.getAmount() : ""
  )

  // decompose complex js class type into its primitive types
  const propValueAmount = props.value ? props.value.getAmount() : null
  const propValueCurrency = props.value ? props.value.getCurrency() : null
  const propValueSymbol = props.value ? props.value.getSymbol() : null

  useEffect(() => {
    if (propValueAmount) {
      if (isNaN(propValueAmount)) {
        setValue("")
      } else {
        let adjustedPropValueAmount = propValueAmount.replace(".", ",")
        setValue(adjustedPropValueAmount)
      }
    }
  }, [propValueAmount])

  useEffect(() => {
    if (propValueCurrency && propValueSymbol) {
      setSelectedCurrency(propValueCurrency)
      setCurrencySymbol(propValueSymbol)
    }
  }, [propValueCurrency, propValueSymbol])

  const onChange = (e) => {
    const { value } = e.target
    const reg = /^\d*((,|\.)\d{0,2})?$/
    if (reg.test(value) || value === "") {
      setValue(value)
      if (
        value.charAt(value.length - 1) !== "." &&
        value.charAt(value.length - 1) !== "," &&
        value !== ""
      ) {
        let newValue = value.replace(",", ".")
        newValue = new Money(newValue, selectedCurrency)
        props.onChange(newValue)
      }
    }
  }

  const onBlur = () => {
    const { onBlur, onChange } = props
    let newValue = value
    if (newValue === "") newValue = "0"
    if (
      value.charAt(value.length - 1) === "." ||
      value.charAt(value.length - 1) === ","
    ) {
      newValue = newValue.slice(0, -1)
    }
    if (value.charAt(0) === "," || value.charAt(0) === ".") {
      newValue = `0${newValue}`
    }

    newValue = newValue.replace(/0*(\d+)/, "$1")

    // Max check
    if (props.max !== undefined) {
      let maxMoney = new Money(props.max, selectedCurrency)
      let inputNumberValue = newValue.replace(",", ".")
      inputNumberValue = new Money(inputNumberValue, selectedCurrency)
      if (inputNumberValue.compare(maxMoney) > 0) {
        newValue = maxMoney.getAmount()
      }
    }

    setValue(newValue)

    newValue = newValue.replace(",", ".")
    onChange(new Money(newValue, selectedCurrency))
    if (onBlur) {
      onBlur()
    }
  }

  const handleCurrencySelect = (selectedCurrency) => {
    const { onChange } = props
    switch (selectedCurrency) {
      case "USD":
        setCurrencySymbol("$")
        break
      case "EUR":
        setCurrencySymbol("€")
        break
      case "TRY":
        setCurrencySymbol("₺")
        break
      case "GBP":
        setCurrencySymbol("£")
        break
      default:
        setCurrencySymbol("₺")
    }
    setSelectedCurrency(selectedCurrency)
    onChange(new Money(propValueAmount, selectedCurrency))
  }

  // omit props that are specific to MoneyInput
  const otherProps = _.omit(props, "currencySelection")

  return (
    <Input
      {...otherProps}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="Tutar Giriniz"
      maxLength={25}
      prefix={currencySymbol}
      addonAfter={
        props.currencySelection && (
          <Select
            defaultValue="TRY"
            style={{ width: 80 }}
            onChange={handleCurrencySelect}
            value={selectedCurrency}
            disabled={props.disabled}
          >
            <Select.Option value="TRY">TRY</Select.Option>
            <Select.Option value="USD">USD</Select.Option>
            <Select.Option value="EUR">EUR</Select.Option>
            <Select.Option value="GBP">GBP</Select.Option>
          </Select>
        )
      }
      autoComplete="off"
    />
  )
}

MoneyInput.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.object,
  currencySelection: PropTypes.bool,
  defaultValue: PropTypes.instanceOf(Money),
  max: PropTypes.number,
  disabled: PropTypes.bool,
}

MoneyInput.defaultProps = {
  currencySelection: true,
  disabled: false,
}

export default MoneyInput
