/// <reference types="cypress" />
// @ts-check
it('loads', () => {
  // application should be running at port 3000
  cy.visit('localhost:3000')

  // passing assertions
  // https://on.cypress.io/get
  cy.get('.new-todo').get('footer')

  // this assertion fails on purpose
  // can you fix it?
  // https://on.cypress.io/get
  cy.get('h1').contains('h1', 'todos') //first option with element (bad)
  cy.get('[data-cy=app-title]').should('contain', 'todos') //second option with data-cy (better approach)
  cy.contains('[data-cy=app-title]', 'todos')

  // can you write "cy.contains" using regular expression? - no, you can't
  // cy.contains('h1', /.../)

  // also good practice is to use data attributes specifically for testing
  // see https://on.cypress.io/best-practices#Selecting-Elements
  // which play well with "Selector Playground" tool
  // how would you do select this element?
})
