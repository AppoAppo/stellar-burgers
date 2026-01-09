import { SELECTORS } from 'cypress/constants/selectors';
describe('Добавление ингредиентов в конструктор', function () {
  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Добавление булки в конструктор', function () {
    cy.get(SELECTORS.bunIngredients).contains(SELECTORS.addButton).click();
    cy.get(SELECTORS.constructorBunTop).contains('Булка 1').should('exist');
    cy.get(SELECTORS.constructorBunBottom).contains('Булка 1').should('exist');
  });

  it('Добавление ингредиентов в конструктор', function () {
    cy.get(SELECTORS.mainIngredients).contains(SELECTORS.addButton).click();
    cy.get(SELECTORS.sauceIngredients).contains(SELECTORS.addButton).click();
    cy.get(SELECTORS.constructorIngredients).as('constructorIngredients');
    cy.get('@constructorIngredients').contains('Котлета 1').should('exist');
    cy.get('@constructorIngredients').contains('Соус 1').should('exist');
  });
});

describe('Работа модального окна ингредиентов', function () {
  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Открытие модального окна ингредиента', function () {
    cy.contains(SELECTORS.ingredientDetailsTitle).should('not.exist');
    cy.contains('Булка 1').click();
    cy.contains(SELECTORS.ingredientDetailsTitle).should('exist');
    cy.get(SELECTORS.modalContainer).contains('Булка 1').should('exist');
  });

  it('Закрытие модального окна ингредиента', function () {
    cy.contains('Булка 1').click();
    cy.contains(SELECTORS.ingredientDetailsTitle).should('exist');
    cy.get(SELECTORS.closeModalButton).click();
    cy.contains(SELECTORS.ingredientDetailsTitle).should('not.exist');
  });
});

describe('Проверка оформления заказа', function () {
  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'post_order.json' }).as(
      'postOrder'
    );

    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');
    cy.visit('/');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  it('Закрытие модального окна ингредиента', function () {
    cy.get(SELECTORS.bunIngredients).contains(SELECTORS.addButton).click();
    cy.get(SELECTORS.mainIngredients).contains(SELECTORS.addButton).click();
    cy.get(SELECTORS.sauceIngredients).contains(SELECTORS.addButton).click();
    cy.get(SELECTORS.orderButton).click();

    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: [
          '1',
          '2',
          '3',
          '1' // Добавленные в бургер ингредиенты (булка добавляется дважды)
        ]
      });

    cy.get(SELECTORS.orderNumber).contains('80126').should('exist');
    cy.get(SELECTORS.closeModalButton).click();
    cy.get(SELECTORS.orderNumber).should('not.exist');

    cy.get(SELECTORS.constructorContainer).as('constructorContainer');
    cy.get('@constructorContainer').contains('Булка 1').should('not.exist');
    cy.get('@constructorContainer').contains('Котлета 1').should('not.exist');
    cy.get('@constructorContainer').contains('Соус 1').should('not.exist');
  });
});
