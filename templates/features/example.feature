Feature: Example Feature
  As a user
  I want to perform example actions
  So that I can verify the framework setup

  Scenario: Basic login functionality
    Given I am on the login page
    When I enter valid credentials
    Then I should be logged in successfully

  Scenario: Data masking example
    Given I have sensitive data in my properties file
    When I access the masked data
    Then it should be automatically decrypted 