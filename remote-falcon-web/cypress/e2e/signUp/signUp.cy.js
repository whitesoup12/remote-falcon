describe('Sign Up', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.config('baseUrl')}`);
    cy.get('#appbar-signup').click();
  });

  context('Go back to Sign In', () => {
    it('Has the correct link', () => {
      cy.get('#signup-signin-instead').should('have.attr', 'href').and('equal', '/signin');
    });
    it('Navigates to the correct link', () => {
      cy.get('#signup-signin-instead').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/signin`);
    });
  });

  context('Input field validations', () => {
    it('All fields required', () => {
      cy.get('#signup-show-name').focus().blur();
      cy.get('#signup-email').focus().blur();
      cy.get('#signup-password').focus().blur();
      cy.get('#signup-show-name-error').should('exist').and('have.text', 'Show Name is required');
      cy.get('#signup-email-error').should('exist').and('have.text', 'Email is required');
      cy.get('#signup-password-error').should('exist').and('have.text', 'Password is required');
    });
  });

  context('Show Name input', () => {
    it('Show name letter and numbers only', () => {
      cy.get('#signup-show-name').focus().type('Show Name!').blur();
      cy.get('#signup-email').focus().type('mail@email.com').blur();
      cy.get('#signup-password').focus().type('abc123').blur();
      cy.get('#signup-email-error').should('not.exist');
      cy.get('#signup-show-name-error').should('exist').and('have.text', 'Letters and Numbers only');
      cy.get('#signup-password-error').should('not.exist');
    });
  });

  context('Email input', () => {
    it('Email is valid', () => {
      cy.get('#signup-first-name').focus().type('First').blur();
      cy.get('#signup-last-name').focus().type('Last').blur();
      cy.get('#signup-show-name').focus().type('Show Name').blur();
      cy.get('#signup-email').focus().type('mail@email').blur();
      cy.get('#signup-password').focus().type('abc123').blur();
      cy.get('#signup-first-name-error').should('not.exist');
      cy.get('#signup-last-name-error').should('not.exist');
      cy.get('#signup-show-name-error').should('not.exist');
      cy.get('#signup-email-error').should('exist').and('have.text', 'Must be a valid email');
      cy.get('#signup-password-error').should('not.exist');
    });
  });

  context('Sign Up', () => {
    it('Show or email exists', () => {
      cy.intercept('POST', '/remote-falcon-control-panel/graphql', { fixture: 'signUp/showExists.json' }).as('signUp');
      cy.get('#signup-first-name').focus().type('First').blur();
      cy.get('#signup-last-name').focus().type('Last').blur();
      cy.get('#signup-show-name').focus().type('Show Name').blur();
      cy.get('#signup-email').focus().type('mail@mail.com').blur();
      cy.get('#signup-password').focus().type('abc123').blur();
      cy.get('#signup-first-name-error').should('not.exist');
      cy.get('#signup-last-name-error').should('not.exist');
      cy.get('#signup-show-name-error').should('not.exist');
      cy.get('#signup-email-error').should('not.exist');
      cy.get('#signup-password-error').should('not.exist');
      cy.get('#signup-submit').click();
      cy.wait('@signUp').then((interception) => {
        assert.isNotNull(interception.response.statusCode, '200');
        cy.get('#snackbar-sign-up').should('exist').and('have.text', 'That email or show name already exists');
      });
    });
    it('Successful', () => {
      cy.intercept('POST', '/remote-falcon-control-panel/graphql', { fixture: 'signUp/successful.json' }).as('signUp');
      cy.get('#signup-first-name').focus().type('First').blur();
      cy.get('#signup-last-name').focus().type('Last').blur();
      cy.get('#signup-show-name').focus().type('Show Name').blur();
      cy.get('#signup-email').focus().type('mail@mail.com').blur();
      cy.get('#signup-password').focus().type('abc123').blur();
      cy.get('#signup-first-name-error').should('not.exist');
      cy.get('#signup-last-name-error').should('not.exist');
      cy.get('#signup-show-name-error').should('not.exist');
      cy.get('#signup-email-error').should('not.exist');
      cy.get('#signup-password-error').should('not.exist');
      cy.get('#signup-submit').click();
      cy.wait('@signUp').then((interception) => {
        assert.isNotNull(interception.response.statusCode, '200');
        cy.get('#snackbar-sign-up').should('exist').and('have.text', 'A verification email has been sent to mail@mail.com');
      });
    });
  });
});
