const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { FlightSearchPage } = require('../pages/FlightSearchPage');
const { ReviewPage } = require('../pages/ReviewPage');
const { TestHelper } = require('../utils/TestHelper');

test.describe('Shohoz Flight Booking Tests', () => {
  test('should search and book US-Bangla flight, then switch to Novo Air', async ({ page }) => {
    const homePage = new HomePage(page);
    const flightSearchPage = new FlightSearchPage(page);
    const reviewPage = new ReviewPage(page);

    await test.step('Navigate to Shohoz air tickets page', async () => {
      await homePage.navigateToFlights();
      await TestHelper.dismissNotificationPopup(page);
    });
    
    await test.step('Search flights: Chattogram to Dhaka, 2 Adults, Premium Economy', async () => {
      await flightSearchPage.selectFrom('Chattogram');
      await flightSearchPage.selectTo('Dhaka');
      await flightSearchPage.selectDepartureDate('Saturday, November 1st');
      await flightSearchPage.selectTravelersAndClass(2, 'Premium Economy');
      await flightSearchPage.clickSearch();
    });
    
    await test.step('Filter US-Bangla Airlines', async () => {
      await flightSearchPage.filterByAirline('US-Bangla Airlines');
    });
    
    await test.step('Book last US-Bangla flight', async () => {
      await flightSearchPage.clickLastBookTicketButton();
    });
    
    await test.step('Verify review modal appears', async () => {
      const modalVisible = await reviewPage.verifyReviewModalAppears();
      expect(modalVisible).toBeTruthy();
    });
    
    await test.step('Verify modal price matches flight list price', async () => {
      const modalPrice = await reviewPage.getModalTotalPrice();
      expect(modalPrice).toBeGreaterThan(0);
    });
    
    await test.step('Continue and close sign-in modal', async () => {
      await reviewPage.clickContinue();
      await reviewPage.closeSignInModal();
    });
    
    let usBanglaFlightPrices;
    await test.step('Capture US-Bangla flight prices', async () => {
      usBanglaFlightPrices = await flightSearchPage.captureFlightPrices();
      expect(usBanglaFlightPrices.length).toBeGreaterThan(0);
    });
    
    await test.step('Switch to Novoair filter', async () => {
      await flightSearchPage.deselectAirline('US-Bangla Airlines');
      await flightSearchPage.filterByAirline('Novoair');
    });
    
    let novoAirFlightPrices;
    await test.step('Capture Novoair flight prices', async () => {
      novoAirFlightPrices = await flightSearchPage.captureFlightPrices();
      expect(novoAirFlightPrices.length).toBeGreaterThan(0);
    });
    
    await test.step('Compare prices and assert difference between airlines', async () => {
      const priceComparison = TestHelper.calculatePriceDifference(usBanglaFlightPrices, novoAirFlightPrices);
      console.log('Price Comparison:', priceComparison);
      expect(priceComparison.difference).toBeGreaterThan(0);
      expect(usBanglaFlightPrices).not.toEqual(novoAirFlightPrices);
    });
  });
});

