Feature: Context Root of this API
  In order to use the Candlebot API, it must be available

  Scenario: ContextRoot https
    Given the candlebot application is alive
    When I navigate to https://candlebot.trade.trevorism.com/api
    Then the API returns a link to the help page

  Scenario: Ping https
    Given the candlebot application is alive
    When I navigate to /ping on https://candlebot.trade.trevorism.com/api
    Then pong is returned, to indicate the service is alive

