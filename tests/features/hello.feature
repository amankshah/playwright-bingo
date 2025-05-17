Feature: Hello Page
  Scenario: Verify welcome message on hello page
    Given I am on the hello page
    Then I should see the welcome message in hello page "Welcome to Playwright Bingo!"
