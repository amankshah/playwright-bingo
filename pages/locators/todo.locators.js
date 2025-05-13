class TodoLocators {
    constructor(page) {
        this.page = page;
        
        // Todo list locators
        this.todoInput = [
            'input[placeholder="What needs to be done false?"]', 
            'input[placeholder="What needs to be done?"]'];
        this.todoList = ['.todo-lis0', '.todo-list'];
        this.todoItems = '[data-testid="todo-item"]';
        this.todoItemCheckbox = 'input[type="checkbox"]';
        this.todoItemLabel = 'label';
        this.todoItemDeleteButton = '.destroy';
        
        // Filter locators
        this.allFilter = 'a[href="#/"]';
        this.activeFilter = 'a[href="#/active"]';
        this.completedFilter = 'a[href="#/completed"]';
        
        // Other locators
        this.clearCompletedButton = '.clear-completed';
        this.todoCount = '.todo-count';
    }
}

module.exports = TodoLocators; 