export const fixTwo = float => float.toFixed(2)

export const thousandth = number => (number + '').replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')