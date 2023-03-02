/// <reference types="cypress" />
/* eslint-disable no-unused-vars */
it('sets list of todos on the server', () => {
  // load fixture "two-items.json" from the fixtures folder
  // then use it to make POST request to the "/reset" endpoint
  // just like we did to reset the server state
  cy.visit('/')
  cy.fixture('two-items').then((list) => {
    // then use it in the POST request
    cy.request('POST', '/reset', { todos: list })
    expect(list).to.have.length(2)
  })

  // bonus: check that the list has 2 items
})

context('closure variable', () => {
  // store loaded list in this closure variable
  let list

  beforeEach(() => {
    cy.visit('/')
    cy.fixture('two-items').then((l) => {
      list = l
    })
    // then store the loaded items in variable "list"
  })

  it('has two items', () => {
    if (list) {
      expect(list).to.have.length(2)
    }
  })

  it('sets list from context', () => {
    // post items to the server
    cy.fixture('two-items').then((list) => {
      // then use it in the POST request
      cy.request('POST', '/reset', { todos: list })
      expect(list).to.have.length(2)
    })
  })
})

context('this.list', () => {
  let list
  // it is important to use "function () {}"
  // as a callback to "beforeEach", so we have
  // "this" pointing at the test context
  beforeEach(function () {
    cy.fixture('two-items').then((list) => {
      this.list = list
    })
    // then assign value to "this.list"
  })

  // again, it is important to use "function () {}" callback
  // to make sure "this" points at the test context
  it('sets list from context', function () {
    // POST the items to the server using "/reset"
    cy.request('POST', '/reset', { todos: list })
  })

  it('has valid list with 2 items', function () {
    // check that "this.list" has 2 items
    expect(this.list).to.have.length(2)
  })
})

context('@list', () => {
  // again, it is important to use "function () {}"
  // as a callback to "beforeEach" to set the right "this"
  beforeEach(function () {
    cy.visit('/')
    // use shortcut "as('list')" will save the value into "this.list"
    // cy.fixture(<filename>).as(<alias name>)
    cy.fixture('two-items').as('list')
  })

  // again, it is important to use "function () {}" callback
  // to make sure "this" points at the test context
  it('sets list from context', function () {
    // use "this.list" like before to send the list to the server
    expect(this.list).to.have.length(2)
  })
})

// show that immediately using "this.list" does not work
it('does not work', function () {
  cy.fixture('two-items').as('list')
  //expect('@list').to.have.length(2)
  cy.get('@list').should('have.length', 2)
  // load fixture and set it as "list"
  // then try checking "this.list" immediately
})

it('works if we change the order', function () {
  cy.fixture('two-items')
    .as('list')
    .then(() => {
      // by now the fixture has been saved into "this.list"
      // check that "this.list" has 2 items
      // use it to post to the server
      expect(this.list).to.have.length(2)
      cy.request('POST', '/reset', { todos: this.list })
    })
})

it('reads items loaded from fixture', () => {
  cy.fixture('two-items').then((todos) => {
    cy.request('POST', '/reset', { todos })
    // post items
    cy.readFile('todomvc/data.json').then((content) => {
      expect(content.todos).to.deep.equal(todos)
      expect(content.todos[1].title).to.deep.equal(todos[1].title)
    })
    // read file 'todomvc/data.json',
    // should be equal to the loaded fixture
    // note: JSON is parsed automatically!
  })
})

it('saves todo', () => {
  cy.request('POST', '/reset', { todos: [] })
  // reset data on the server
  cy.visit('/')
  // visit the page
  cy.get('.new-todo').type('todo 0{enter}')
  cy.wait(3000)
  cy.get('.new-todo').type('todo 1{enter}')
  // type new todo via GUI
  cy.readFile('todomvc/data.json').should((content) => {
    expect(content.todos[0].title).to.equal('todo 0')
    //cy.contains('[data-cy="ul-todo"]').should('deep.equal', content.todos)
  })
  // read file - it should have the item you have entered
  // hint: to demonstrate retries,
  // write should(cb) assertion
  // and add a delay to the application
})

context('app actions with fixtures', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.fixture('two-items').as('twoitems')
    // load fixture two-items
    // visit the page, make sure it has been loaded
  })

  it.only('invokes app action to set data from fixture', function () {
    // grab window app.$store
    // and for each item from the fixture
    // dispatch action "addEntireTodo"
    cy.window()
      .its('app.$store')
      .then(($store) => {
        this.twoitems.forEach((item) =>
          $store.dispatch('addEntireTodo', {
            title: item.title,
            completed: item.completed
          })
        )
      })
  })
  // create items by dispatching actions
})
