Feature: Store Shopping

  Scenario: Homepage loads successfully
    Given I open the store homepage
    Then the page title should contain "TestDino"

  Scenario: Search for a product
    Given I open the store homepage
    When I search for "laptop"
    Then I should see search results

  Scenario: Add a product to cart
    Given I open the store homepage
    When I add the first product to the cart
    Then the cart count should be greater than zero
