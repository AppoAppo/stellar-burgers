describe('Добавление ингредиентов в конструктор', function () {
  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });

  it('Добавление булки в конструктор', function () {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-top]').contains('Булка 1').should('exist');
    cy.get('[data-cy=constructor-bun-bottom]')
      .contains('Булка 1')
      .should('exist');
  });

  it('Добавление ингредиентов в конструктор', function () {
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauce-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Котлета 1')
      .should('exist');
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Соус 1')
      .should('exist');
  });
});

describe('Работа модального окна ингредиентов', function () {
  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });

  it('Открытие модального окна ингредиента', function () {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Булка 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Булка 1').should('exist');
  });

  it('Закрытие модального окна ингредиента', function () {
    cy.contains('Булка 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals button[aria-label="Закрыть"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
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
    cy.visit('http://localhost:4000');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  it('Закрытие модального окна ингредиента', function () {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauce-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=order-total] button').contains('Оформить заказ').click();

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

    cy.get('[data-cy=order-number]').contains('80126').should('exist');
    cy.get('#modals button[aria-label="Закрыть"]').click();
    cy.get('[data-cy=order-number]').should('not.exist');

    cy.get('[data-cy=constructor]').contains('Булка 1').should('not.exist');
    cy.get('[data-cy=constructor]').contains('Котлета 1').should('not.exist');
    cy.get('[data-cy=constructor]').contains('Соус 1').should('not.exist');
  });
});
