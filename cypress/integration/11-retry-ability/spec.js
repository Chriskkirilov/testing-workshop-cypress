/// <reference types="cypress" />

/* eslint-disable no-unused-vars */
beforeEach(function resetData() {
  cy.request('POST', '/reset', {
    todos: []
  })
  cy.visit('/')
})

it('shows UL', function () {
  cy.get('[data-cy="addTodoItem"]')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.get('[data-cy="ul-todo"]')
    .should('be.visible')
    .should('have.class', 'todo-list')
    .should('css', 'list-style-type', 'none') //reach out a property value outside out scope
  //.and('equal', 'none')
  // confirm that the above element
  //  1. is visible
  //  2. has class "todo-list"
  //  3. css property "list-style-type" is equal "none"
})

it('shows UL - TDD', function () {
  cy.get('.new-todo')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.contains('ul', 'todo A').then(($ul) => {
    assert($ul.is(':visible'), 'ul is visible')
    assert.equal($ul[0].className, 'todo-list')
    assert.isTrue($ul.hasClass('todo-list'))
    assert.equal($ul.css('list-style-type'), 'none')
    // use TDD assertions
    // $ul is visible
    // $ul has class "todo-list"
    // $ul css has "list-style-type" = "none"
  })
})

it('every item starts with todo', function () {
  cy.get('[data-cy="addTodoItem"]')
    .type('todo A{enter}')
    .type('todo B{enter}')
    .type('todo C{enter}')
    .type('todo D{enter}')
  cy.get('.todo label').should(($labels) => {
    assert.equal($labels.length, 4)

    $labels.each((lab, label) => {
      expect(label.textContent).to.match(/^todo /)
    })
    // confirm that there are 4 labels
    // and that each one starts with "todo-"
  })
})

it('has the right label', () => {
  cy.get('[data-cy="addTodoItem"]').type('todo A{enter}')
  cy.get('[data-cy="itemFromList"]').find('label').should('contain', 'todo A')
  // ?
})

// flaky test - can pass or not depending on the app's speed
// to make the test flaky add the timeout
// in todomvc/app.js "addTodo({ commit, state })" method
it('has two labels', () => {
  cy.get('[data-cy="addTodoItem"]').type('todo A{enter}')
  cy.get('.todo-list li') // command
    .find('label') // command
    .should('contain', 'todo A') // assertion

  cy.get('[data-cy="addTodoItem"]', { timeout: 20000 }).type('todo B{enter}')
  // ? copy the same check as above
  // then make the test flaky ...
  cy.get('.todo-list li') // command
    .find('label') // command
    .should('contain', 'todo A') // assertion
})

it('solution 1: merges queries', () => {
  cy.get('[data-cy="addTodoItem"]').type('todo A{enter}')
  cy.get('.todo-list li label').should('contain', 'todo A')
  // ?

  cy.get('[data-cy="addTodoItem"]').type('todo B{enter}')
  cy.get('.todo-list li label').should('contain', 'todo B')
  // ?
})

it('solution 2: alternate commands and assertions', () => {
  cy.get('[data-cy="addTodoItem"]')
    .type('todo A{enter}')
    .should('have.length', 1) // assertion
    .find('label') // command
    .should('contain', 'todo A')
  // ?

  cy.get('[data-cy="addTodoItem"]')
    .type('todo B{enter}')
    .type('todo A{enter}')
    .should('have.length', 1) // assertion
    .find('label') // command
    .should('contain', 'todo B')
  // ?
})

it.only('retries reading the JSON file', () => {
  cy.get('[data-cy="addTodoItem"]').type('todo A{enter}')
  cy.get('[data-cy="addTodoItem"]').type('todo b{enter}')
  cy.get('[data-cy="addTodoItem"]').type('todo c{enter}')
  cy.get('[data-cy="addTodoItem"]').type('todo d{enter}')
  cy.get('[data-cy="addTodoItem"]').type('todo w4{enter}')

  cy.readFile('./todomvc/data.json').should((data) => {
    expect(data).to.have.property('todos')
    expect(data.todos).to.have.length(5)
    expect(data.todos[0]).to.include({
      title: 'todo A'
    })
  })
  //cy.get('@file').should('have.length', 5)
  //cy.get('@file').first().should('contain', 'todo A')

  // add N items via UI
  // then read the file ./todomvc/data.json
  // and assert it has the N items and the first item
  // is the one entered first
  // note cy.readFile retries reading the file until the should(cb) passes
  // https://on.cypress.io/readilfe
})
