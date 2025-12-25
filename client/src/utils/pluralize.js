/**
 * Утилита для правильного склонения русских слов
 */

/**
 * Получает правильную форму слова в зависимости от числа
 * @param {number} count - Число
 * @param {string} singular - Форма единственного числа
 * @param {string} few - Форма для 2-4
 * @param {string} many - Форма для 5+ и 0
 * @returns {string} Правильная форма слова
 */
export const pluralize = (count, singular, few, many) => {
  const absCount = Math.abs(count)

  // Правила русского склонения
  if (absCount % 10 === 1 && absCount % 100 !== 11) {
    return singular
  }

  if (
    absCount % 10 >= 2 &&
    absCount % 10 <= 4 &&
    (absCount % 100 < 10 || absCount % 100 >= 20)
  ) {
    return few
  }

  return many
}

/**
 * Специализированная функция для склонения слова "товар"
 * @param {number} count - Количество товаров
 * @returns {string} Правильная форма слова "товар"
 */
export const pluralizeItem = (count) => {
  return pluralize(count, 'товар', 'товара', 'товаров')
}

/**
 * Специализированная функция для склонения слова "штука"
 * @param {number} count - Количество штук
 * @returns {string} Правильная форма слова "штука"
 */
export const pluralizePiece = (count) => {
  return pluralize(count, 'штука', 'штуки', 'штук')
}

/**
 * Специализированная функция для склонения слова "рубль"
 * @param {number} count - Количество рублей
 * @returns {string} Правильная форма слова "рубль"
 */
export const pluralizeRuble = (count) => {
  return pluralize(count, 'рубль', 'рубля', 'рублей')
}
