/// <reference types="cypress" />

it.only('loads', () => {
  // application should be running at port 3000
  cy.visit('localhost:3000')
  cy.contains('h1', 'todos')
})

// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
// remember to manually delete all items before running the test
// IMPORTANT ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

it('adds two items', () => {
  // repeat twice
  //    get the input field
  //    type text and "enter"
  //    assert that the new Todo item
  //    has been added added to the list
  // cy.get(...).should('have.length', 2)
  for (let i = 0; i < 2; i++) {
    cy.get('.new-todo').type('LMAO{enter}')
    cy.get('[class="todo-list"] li').contains('LMAO')
  }
  cy.get('.view').should('have.length', 2)
})

it('can mark an item as completed', () => {
  // adds a few items
  // marks the first item as completed
  // confirms the first item has the expected completed class
  // confirms the other items are still incomplete
  cy.get('.new-todo').type('bwawa{enter}').as('bwawa')
  cy.get('.new-todo').type('meow{enter}').as('meow')
  cy.get('[class="toggle"]').first().check().as('checkedFirst')
  cy.get('@checkedFirst').should('be.checked')
  cy.contains('li.todo', 'bwawa').should('have.class', 'completed')
  cy.contains('li.todo', 'meow').should('not.have.class', 'completed')
})

it('can delete an item', () => {
  // adds a few items
  // deletes the first item
  // use force: true because we don't want to hover
  // confirm the deleted item is gone from the dom
  // confirm the other item still exists

  cy.get('.new-todo').type('apple{enter}')
  cy.get('.new-todo').type('doctor{enter}')
  cy.get('li.todo').contains('apple').as('apple')
  cy.get('li.todo').contains('doctor').as('doctor')
  cy.contains('li.todo', 'apple').find('.destroy').click({ force: true })
  cy.get('@apple').should('not.exist')
  cy.get('@doctor').should('exist')
})

it('can add many items', () => {
  const N = 5
  for (let k = 0; k < N; k += 1) {
    // add an item
    // probably want to have a reusable function to add an item!
    cy.get('.new-todo').type('cherry{enter}')
  }
  cy.get('li.todo').should('have.length', 5)
  // check number of items
})

it.only('adds item with random text', () => {
  // use a helper function with Math.random()
  // or Cypress._.random() to generate unique text label
  // add such item
  // and make sure it is visible and does not have class "completed"
  const uuid = () => Cypress._.random(0, 1e6)
  const id = uuid()
  cy.log(id)
  cy.get('.new-todo').type(id).type('{enter}')
  cy.contains('li.todo', id).should('not.have.class', 'completed')
})

it('starts with zero items', () => {
  // check if the list is empty initially
  //   find the selector for the individual TODO items
  //   in the list
  //   use cy.get(...) and it should have length of 0
  //   https://on.cypress.io/get
})

it('does not allow adding blank todos', () => {
  // https://on.cypress.io/catalog-of-events#App-Events
  cy.on('uncaught:exception', () => {
    // check e.message to match expected error text
    // return false if you want to ignore the error
  })

  // try adding an item with just spaces
})

// what a challenge?
// test more UI at http://todomvc.com/examples/vue/
