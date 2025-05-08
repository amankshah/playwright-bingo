Feature: Todo Application
  As a user
  I want to manage my tasks
  So that I can keep track of what I need to do

  Scenario: Add a new todo item
    Given I am on the todo page
    When I add a new todo "Learn Playwright Bingo"
    Then I should see "Learn Playwright Bingo" in the todo list

  Scenario: Mark a todo as complete
    Given I am on the todo page
    And I have a todo "Learn Playwright Bingo"
    When I mark "Learn Playwright Bingo" as complete
    Then "Learn Playwright Bingo" should be marked as complete

  Scenario: Delete a todo item
    Given I am on the todo page
    And I have a todo "Learn Playwright Bingo"
    When I delete "Learn Playwright Bingo"
    Then "Learn Playwright Bingo" should not be in the todo list 