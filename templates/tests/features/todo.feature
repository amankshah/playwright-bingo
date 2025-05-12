Feature: Todo List Management
  As a user
  I want to manage my todo items
  So that I can keep track of my tasks

  Scenario: Add a new todo item
    Given I am on the todo page
    When I add a new todo item "Buy groceries"
    Then I should see "Buy groceries" in the todo list

  Scenario: Complete a todo item
    Given I am on the todo page
    And I have a todo item "Buy groceries"
    When I complete the todo item "Buy groceries"
    Then It should show as completed

  Scenario: Delete a todo item
    Given I am on the todo page
    And I have a todo item "Buy groceries"
    When I delete the todo item "Buy groceries"
    Then It should be removed from the list

  Scenario: Verify masked credentials
    Given I am on the todo page
    When I enter my credentials
    Then I should see "Email: test@example.com"
    And I should see "Password: secret" 


