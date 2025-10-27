const { waitForPageLoad } = require('../utils/waitForPageLoad');

class FlightSearchPage {
  constructor(page) {
    this.page = page;
    this.fromField = page.locator('.form_select').first();
    this.fromInput = page.getByRole('textbox', { name: 'Leaving From' });
    this.toField = page.locator('.form_select').nth(1);
    this.toInput = page.getByRole('textbox', { name: 'Arrival To' });
    this.dropdownItem = page.locator('.item_box .item');
    this.dateField = page.locator('.react-datepicker-wrapper input').first();
    this.nextMonthButton = page.getByRole('button', { name: 'Next Month' });
    this.travelersButton = page.getByRole('button', { name: 'Traveler, Class' });
    this.doneButton = page.getByRole('button', { name: 'Done' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.backdrop = page.locator('.offcanvas-backdrop, .modal-backdrop').first();
    this.bookTicketButtons = page.getByRole('button', { name: 'BOOK TICKET' });
    this.priceElements = page.locator('text=/৳[\\d,]+/');
  }

  async selectFrom(city) {
    await this.fromField.click();
    await this.page.waitForTimeout(500);
    await this.fromInput.clear();
    await this.fromInput.fill(city);
    await this.page.waitForTimeout(2000);
    const option = this.dropdownItem.filter({ hasText: `${city}, Bangladesh` }).first();
    await option.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(500);
    await option.evaluate(el => el.click());
    await this.page.waitForTimeout(1000);
  }

  async selectTo(city) {
    await this.toField.click();
    await this.page.waitForTimeout(500);
    await this.toInput.clear();
    await this.toInput.fill(city);
    await this.page.waitForTimeout(2000);
    const option = this.dropdownItem.filter({ hasText: `${city}, Bangladesh` }).first();
    await option.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(500);
    await option.evaluate(el => el.click());
    await this.page.waitForTimeout(1000);
  }

  async selectDepartureDate(day) {
    await this.dateField.click();
    await this.page.waitForTimeout(1000);
    await this.nextMonthButton.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: day }).first().click();
  }

  async selectTravelersAndClass(adults, travelClass) {
    await this.travelersButton.click();
    await this.page.waitForTimeout(500);
    
    await this.page.getByRole('button', { name: travelClass }).click();
    await this.page.waitForTimeout(300);
    
    for (let i = 1; i < adults; i++) {
      await this.page.getByRole('button', { name: '+' }).first().click();
      await this.page.waitForTimeout(200);
    }
    
    await this.doneButton.click();
  }

  async clickSearch() {
    await this.searchButton.click();
    await waitForPageLoad(this.page);
    await this.page.waitForTimeout(5000);
  }

  async filterByAirline(airlineName) {
    await this.page.waitForTimeout(3000);
    
    if (await this.backdrop.isVisible().catch(() => false)) {
      await this.backdrop.click({ timeout: 1000 }).catch(() => {});
      await this.page.waitForTimeout(500);
    }
    
    const checkbox = this.page.locator(`label:has-text("${airlineName}")`).first();
    if (await checkbox.count() > 0) {
      await checkbox.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await checkbox.click({ force: true });
    }
    await this.page.waitForTimeout(3000);
  }

  async deselectAirline(airlineName) {
    await this.page.waitForTimeout(500);
    
    if (await this.backdrop.isVisible().catch(() => false)) {
      await this.backdrop.click({ timeout: 1000 }).catch(() => {});
    }
    await this.page.waitForTimeout(500);
    
    await this.page.locator(`label:has-text("${airlineName}")`).first().click({ force: true });
    await this.page.waitForTimeout(5000);
  }

  async clickLastBookTicketButton() {
    await this.page.waitForTimeout(2000);
    const buttons = await this.bookTicketButtons.all();
    if (buttons.length > 0) {
      await buttons[buttons.length - 1].scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await buttons[buttons.length - 1].click();
    }
  }

  async captureFlightPrices() {
    await this.page.waitForTimeout(2000);
    const count = await this.priceElements.count();
    const prices = [];
    
    for (let i = 0; i < count; i++) {
      const priceText = await this.priceElements.nth(i).textContent();
      const numericPrice = priceText.replace(/[^0-9]/g, '');
      if (numericPrice && parseInt(numericPrice) > 1000) {
        prices.push(parseInt(numericPrice));
      }
    }
    
    return [...new Set(prices)].sort((a, b) => a - b);
  }
}

module.exports = { FlightSearchPage };

