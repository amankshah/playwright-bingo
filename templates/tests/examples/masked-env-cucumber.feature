Feature: Using masked environment variables in Cucumber tests

  Scenario: Login with masked credentials
    Given I am on the login page
    When I enter my masked email
    And I enter my masked password
    Then I should be logged in successfully

  Scenario: Update profile with masked phone number
    Given I am logged in
    When I navigate to profile settings
    And I update my phone number with masked value
    Then my profile should be updated successfully 