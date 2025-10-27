const { waitForPageLoad } = require('../utils/waitForPageLoad');

class HomePage {
  constructor(page) {
    this.page = page;
  }

  async navigateToFlights() {
    await this.page.goto('https://www.shohoz.com/air-tickets');
    await waitForPageLoad(this.page);
  }
}

module.exports = { HomePage };

