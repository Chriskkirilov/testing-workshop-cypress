import { TodoPage, todoPage } from './todo-page-object'
import { addTodos, allItems, toggle } from './utils'

describe('TAdd several todos with invoke and window', () => {
  beforeEach(() => {
    todoPage.visit()
  })

  it.only('Routing test', () => {
    addTodos('123')
    addTodos('456')
    addTodos('789')
    addTodos('000')
    toggle(1)
    todoPage.filter('Completed')
    todoPage
      .todos()
      .should('have.length', 1)
      .and('contain', '456')
      .and('have.class', 'completed')
  })
})
