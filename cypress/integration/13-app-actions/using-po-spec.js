import { TodoPage, todoPage } from './todo-page-object'
import { addTodos, toggle } from './utils'

describe('TodoMVC with Page Object', () => {
  beforeEach(() => {
    todoPage.visit()
  })

  it.skip('creates 3 todos', () => {
    // create default todos
    // and check that there are 3 of them
    todoPage.createTodos()
    const todos = todoPage.todos()
    todos.should('have.length', 3)
  })

  context('toggles items', () => {
    beforeEach(() => {
      todoPage.createTodos()
      // what should you do before each test?
    })

    it('completes second item', () => {
      todoPage.toggle(0)
      todoPage.todos(0).should('have.class', 'completed')
      todoPage.todos(1, 2).should('not.have.class', 'completed')
      // toggle 1 item
      // check class names for all 3 items
    })

    it.only('access model', () => {
      addTodos('123')
      toggle(1)
    })
  })
})
