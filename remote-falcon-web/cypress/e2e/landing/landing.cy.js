describe('Landing', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}`);
  });

  context('Documentation link', () => {
    it('Has the correct link', () => {
      cy.get('#appbar-documentation').should('have.attr', 'href').and('equal', 'https://docs.remotefalcon.com');
    });
  });

  context('AppBar Sign In link', () => {
    it('Has the correct link', () => {
      cy.get('#appbar-signin').should('have.attr', 'href').and('equal', '/signin');
    });
    it('Navigates to the correct link', () => {
      cy.get('#appbar-signin').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/signin`);
    });
  });

  context('AppBar Sign Up link', () => {
    it('Has the correct link', () => {
      cy.get('#appbar-signup').should('have.attr', 'href').and('equal', '/signup');
    });
    it('Navigates to the correct link', () => {
      cy.get('#appbar-signup').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/signup`);
    });
  });

  context('KeyFeature Sign In link', () => {
    beforeEach(() => {
      cy.get('#keyfeature-signin-signup').scrollIntoView();
    });
    it('Has the correct link', () => {
      cy.get('#keyfeature-signin').should('have.attr', 'href').and('equal', '/signin');
    });
    it('Navigates to the correct link', () => {
      cy.get('#keyfeature-signin').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/signin`);
    });
  });

  context('KeyFeature Sign Up link', () => {
    it('Has the correct link', () => {
      cy.get('#keyfeature-signin-signup').scrollIntoView();
      cy.get('#keyfeature-signup').should('have.attr', 'href').and('equal', '/signup');
    });
    it('Navigates to the correct link', () => {
      cy.get('#keyfeature-signin-signup').scrollIntoView();
      cy.get('#keyfeature-signup').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/signup`);
    });
  });
});
