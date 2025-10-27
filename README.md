# Shohoz Flight Booking Test Automation

This is a Playwright automation framework for testing flight booking on Shohoz.com. It uses Page Object Model to keep things organized.

## What's Inside

- Page Objects for different pages (Home, Flight Search, Review)
- Helper utilities for common tasks
- Test that books a flight and compares airline prices
- Docker and Jenkins setup for CI

## Getting Started

Install dependencies:
```bash
npm install
npx playwright install chromium
```

Run tests:
```bash
npm test
```

Run with browser visible:
```bash
npx playwright test --headed
```

## What the Test Does

The test goes through this flow:
1. Opens Shohoz flight booking page
2. Searches for flights from Chattogram to Dhaka (2 adults, Premium Economy)
3. Filters by US-Bangla Airlines
4. Clicks book on the last flight shown
5. Checks the review modal appears
6. Verifies the price shown
7. Captures all US-Bangla flight prices
8. Switches filter to Novoair
9. Captures Novoair flight prices
10. Compares prices between both airlines

## Project Structure

```
.
├── pages/                    # Page objects
│   ├── HomePage.js
│   ├── FlightSearchPage.js
│   └── ReviewPage.js
├── tests/                    # Test files
│   └── shohoz-flight.spec.js
├── utils/                    # Helper functions
│   ├── TestHelper.js
│   └── waitForPageLoad.js
├── playwright.config.js      # Playwright config
├── Dockerfile
└── Jenkinsfile
```

## Running with Docker

```bash
docker build -t shohoz-tests .
docker run shohoz-tests
```

## Jenkins Pipeline

The Jenkinsfile runs tests in Docker and generates a report. Just point Jenkins to this repo and it'll work.
