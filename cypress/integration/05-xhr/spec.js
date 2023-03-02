/// <reference types="cypress" />
//
// note, we are not resetting the server before each test
// and we want to confirm that IF the application has items already
// (for example add them manually using the browser localhost:3000)
// then these tests fail!
//
// see https://on.cypress.io/intercept

/* eslint-disable no-unused-vars */

it('starts with zero items (waits)', () => {
  cy.visit('/')
  // wait 1 second
  // then check the number of items
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items', () => {
  cy.intercept('GET', '/todos').as('intercept')
  // start Cypress network proxy with cy.server()
  // spy on route `GET /todos`
  //  with cy.intercept(...).as(<alias name>)
  // THEN visit the page
  cy.visit('/')
  cy.wait('@intercept').its('request.body').should('be.empty')
  // wait for `GET /todos` route
  //  using "@<alias name>" string
  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('starts with zero items (stubbed response)', () => {
  // start Cypress network server
  // stub `GET /todos` with []
  // save the stub as an alias
  cy.intercept('GET', '/todos', {
    todos: []
  }).as('meow')

  // THEN visit the page
  cy.visit('/')
  cy.wait('@meow').its('request.body').should('be.empty')

  // wait for the route alias
  // grab its response body
  // and make sure the body is an empty list
})

it('starts with zero items (fixture)', () => {
  // start Cypress network server
  // stub `GET /todos` with fixture "empty-list"
  cy.intercept('GET', '/todos', {
    fixture: 'empty-list.json'
  }).as('meow')
  // visit the page
  cy.visit('/')
  cy.wait('@meow').its('request.body').should('be.empty')

  // then check the DOM
  cy.get('li.todo').should('have.length', 0)
})

it('loads several items from a fixture', () => {
  // stub route `GET /todos` with data from a fixture file "two-items.json"
  // THEN visit the page
  cy.intercept('GET', '/todos', {
    fixture: 'two-items.json'
  }).as('meow')
  // visit the page
  cy.visit('/')
  cy.wait('@meow')
  cy.get('li.todo').should('have.length', 2)
  cy.contains('li.todo', 'first').as('first')
  cy.contains('li.todo', 'second').as('second')

  cy.get('@first')
    .should('not.have.class', 'completed')
    .find('[data-cy="check-todo"]')
    .should('not.be.checked')
  cy.get('@second')
    .should('have.class', 'completed')
    .find('[data-cy="check-todo"]')
    .should('be.checked')
  // then check the DOM: some items should be marked completed
  // we can do this in a variety of ways
})

it('posts new item to the server', () => {
  // spy on "POST /todos", save as alias
  cy.visit('/')
  cy.get('.new-todo').type('test api{enter}')
  cy.intercept('POST', '/todos').as('post')
  cy.wait('@post')
    .its('request.body')
    .should('contain', { title: 'test api', completed: false })

  // wait on XHR call using the alias, grab its request or response body
  // and make sure it contains
  // {title: 'test api', completed: false}
  // hint: use cy.wait(...).its(...).should('have.contain', ...)
})

it('handles 404 when loading todos', () => {
  // when the app tries to load items
  // set it up to fail with 404 to GET /todos
  // after delay of 2 seconds
  cy.intercept(
    {
      method: 'GET',
      pathname: '/todos'
    },
    { statusCode: 404, delayMs: 2000 }
  ).as('404')
  cy.visit('/', {
    // spy on console.error because we expect app would
    // print the error message there

    onBeforeLoad: (win) => {
      // spy
      cy.spy(win.console, 'error').as('console-error')
    }
  })
  cy.get('@console-error').should(
    'have.been.calledWithExactly',
    'could not load todos'
  )
  // observe external effect from the app - console.error(...)
  // cy.get('@console-error')
  //   .should(...)
})

it('shows loading element', () => {
  // delay XHR to "/todos" by a few seconds
  // and respond with an empty list
  // shows Loading element
  // wait for the network call to complete
  // now the Loading element should go away
  cy.intercept(
    {
      method: 'GET',
      pathname: '/todos'
    },
    { body: [], delay: 3000 }
  ).as('loading')
  cy.visit('/')
  cy.get('.loading').should('be.visible')
  cy.wait('@loading')
  cy.get('.loading').should('not.be.visible')
})

it.only('handles todos with blank title', () => {
  cy.visit('/')
  // return a list of todos with one todo object
  // having blank spaces or null
  // confirm the todo item is shown correctly
  cy.intercept('GET', '/todos', [
    {
      id: '456',
      title: '  ',
      completed: true
    }
  ])
  cy.get('[data-cy="itemFromList"]')
    .as('item')
    .should('contain', ' ')
    .its('.toggle')
    .should('have.class', 'completed')
})

it.only('waits for network to be idle for 1 second', () => {
  // intercept all requests
  // on every intercept set the timestamp
  // retry using should(cb) checking the time
  // that has passed since the network timestamp
  cy.intercept('GET', 'POST', '/todos').as('lol')
  cy.clock(1).as('time')
  cy.wait('@lol')
})
