class TestHelper {
  static calculatePriceDifference(prices1, prices2) {
    const avg1 = prices1.reduce((a, b) => a + b, 0) / prices1.length;
    const avg2 = prices2.reduce((a, b) => a + b, 0) / prices2.length;
    const difference = Math.abs(avg1 - avg2);
    const percentageDiff = ((difference / avg1) * 100).toFixed(2);
    
    return {
      average1: avg1,
      average2: avg2,
      difference: difference,
      percentageDifference: percentageDiff
    };
  }

  static async dismissNotificationPopup(page) {
    try {
      await page.getByRole('button', { name: "Don't Allow" }).click({ timeout: 3000 });
    } catch (e) {
    }
  }
}

module.exports = { TestHelper };

