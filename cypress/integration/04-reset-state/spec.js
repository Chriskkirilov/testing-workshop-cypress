/// <reference types="cypress" />

/**
 * @param {string} text
 */
function addItem(text) {
  cy.get('.new-todo').type(`${text}{enter}`)
}

describe('reset data using XHR call', () => {
  beforeEach(() => {
    // application should be running at port 3000
    // and the "localhost:3000" is set as "baseUrl" in "cypress.json"
    // TODO call /reset endpoint with POST method and object {todos: []}
    cy.request('POST', '/reset', {
      todos: []
    })
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('apple')
    addItem('banana')
    cy.get('[data-cy="viewTodos"]').should('have.length', 2)
  })
})

describe('reset data using cy.writeFile', () => {
  beforeEach(() => {
    // TODO write file "todomvc/data.json" with stringified todos object
    // file path is relative to the project's root folder
    // where cypress.json is located
    cy.writeFile('todomvc/data.json', { todos: [] })
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('[data-cy="itemFromList"]').should('have.length', 2)
  })
})

describe('reset data using a task', () => {
  beforeEach(() => {
    cy.task('resetData')
    // TODO call a task to reset data
    cy.visit('/')
  })

  it('adds two items', () => {
    addItem('first item')
    addItem('second item')
    cy.get('[data-cy="itemFromList"]').should('have.length', 2)
  })
})

describe('set initial data', () => {
  it('sets data to complex object right away', () => {
    // TODO call task and pass an object with todos
    cy.task('resetData', {
      todos: [
        {
          title: 'test1',
          completed: 'true',
          id: '999999'
        },
        {
          title: 'test2',
          completed: 'false',
          id: '1111111111'
        }
      ]
    })
    cy.visit('/')
    // check what is rendered
  })

  it('sets data using fixture', () => {
    // TODO load todos from "cypress/fixtures/two-items.json"
    // and then call the task to set todos
    cy.fixture('two-items.json').then((todos) => {
      // "todos" is an array
      cy.task('resetData', { todos })
    })
    cy.visit('/')
    // check what is rendered
  })
})
