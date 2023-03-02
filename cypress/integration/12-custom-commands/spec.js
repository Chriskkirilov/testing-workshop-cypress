/// <reference types="cypress" />
/// <reference path="./custom-commands.d.ts" />
require('cypress-pipe')
beforeEach(function resetData() {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(function visitSite() {
  cy.visit('/')
})

it('enters 10 todos', function () {
  cy.get('.new-todo')
    .type('todo 0{enter}')
    .type('todo 1{enter}')
    .type('todo 2{enter}')
    .type('todo 3{enter}')
    .type('todo 4{enter}')
    .type('todo 5{enter}')
    .type('todo 6{enter}')
    .type('todo 7{enter}')
    .type('todo 8{enter}')
    .type('todo 9{enter}')
  cy.get('.todo').should('have.length', 10)
})

Cypress.Commands.add('createTodo', (text) => {
  const cmd = Cypress.log({
    name: 'create todo',
    message: text,
    consoleProps() {
      return {
        'Create Todo': text
      }
    }
  })
  cy.get('.new-todo', { log: false })
    .type(`${text}{enter}`, { log: false })
    .then(($el) => {
      cmd.set({ $el }).snapshot().end()
    })
})

it('creates a todo', () => {
  cy.createTodo('meow')
  cy.createTodo('lmao')
})

it.only('passes when object gets new property', () => {
  const o = {}
  setTimeout(() => {
    o.foo = 'bar'
  }, 1000)
  const get = (name) =>
    function getProp(from) {
      console.log('getting', from)
      return from[name]
    }
  cy.wrap(o).pipe(get('foo')).should('not.be.undefined').and('equal', 'bar')
})

it('creates todos', () => {
  cy.get('.new-todo')
    .type('todo 0{enter}')
    .type('todo 1{enter}')
    .type('todo 2{enter}')
  cy.get('.todo').should('have.length', 3)
  cy.window().its('app.todos').toMatchSnapshot()
})
