async function waitForPageLoad(page, timeout = 30000) {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForTimeout(2000);
}

module.exports = { waitForPageLoad };

