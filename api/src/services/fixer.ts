import config from '../config'
import { Currency } from '../models/Expenses'

export const getRate = async (currency: Currency) => {
  const response = await fetch(
    `http://data.fixer.io/api/latest?access_key=${config.fixer_key}&symbols=${currency},USD`
  )

  const data = await response.json()

  return data.rates[currency] / data.rates.USD
}
