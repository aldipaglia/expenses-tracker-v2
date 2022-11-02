export const formatMoney = (n: number) =>
  `$${Number.isSafeInteger(n) ? n : n.toFixed(2)}`
