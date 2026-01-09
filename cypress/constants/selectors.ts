export const SELECTORS = {
  // Ингредиенты (списки)
  bunIngredients: '[data-cy=bun-ingredients]',
  mainIngredients: '[data-cy=main-ingredients]',
  sauceIngredients: '[data-cy=sauce-ingredients]',

  // Элементы конструктора
  constructorBunTop: '[data-cy=constructor-bun-top]',
  constructorBunBottom: '[data-cy=constructor-bun-bottom]',
  constructorIngredients: '[data-cy=constructor-ingredients]',
  constructorContainer: '[data-cy=constructor]',

  // Кнопки и действия
  addButton: 'Добавить',
  orderButton: '[data-cy=order-total] button:contains("Оформить заказ")',

  // Модальные окна
  modalContainer: '#modals',
  closeModalButton: '#modals button[aria-label="Закрыть"]',
  ingredientDetailsTitle: 'Детали ингредиента', // или более надёжный селектор, если есть

  // Результаты заказа
  orderNumber: '[data-cy=order-number]'
} as const;
