export const formatPrice = (price) => {
  const numPrice = Number(price) || 0
  return `${new Intl.NumberFormat('ru-RU').format(numPrice)} ₽`
}
