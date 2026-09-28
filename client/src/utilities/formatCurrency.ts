const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IE", {
  currency: "EUR",
  style: "currency",
});

export const formatCurrency = (number: number) => {
  return CURRENCY_FORMATTER.format(number);
};
