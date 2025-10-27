class ReviewPage {
  constructor(page) {
    this.page = page;
    this.reviewModal = page.getByRole('dialog');
    this.totalPriceHeading = page.getByRole('heading').filter({ hasText: '৳' });
    this.continueButton = page.getByRole('button', { name: 'CONTINUE' });
    this.signInModal = page.locator('.modal, .offcanvas').filter({ hasText: 'Sign in' });
  }

  async verifyReviewModalAppears() {
    await this.reviewModal.first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.reviewModal.first().isVisible();
  }

  async getModalTotalPrice() {
    await this.page.waitForTimeout(1000);
    const priceText = await this.totalPriceHeading.first().textContent();
    const match = priceText.match(/৳([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return null;
  }

  async clickContinue() {
    await this.continueButton.click();
    await this.page.waitForTimeout(2000);
  }

  async closeSignInModal() {
    try {
      if (await this.signInModal.isVisible({ timeout: 2000 })) {
        const closeButton = this.signInModal.locator('button.close, button[aria-label="Close"]').first();
        await closeButton.click({ timeout: 2000 }).catch(() => {});
      }
      await this.page.waitForTimeout(1000);
    } catch (e) {
    }
  }
}

module.exports = { ReviewPage };

