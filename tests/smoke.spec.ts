import { test, expect } from '@playwright/test';

const pages = ['/', '/2-reclaim/', '/3-services/', '/4-story/', '/7-contact/'];

for (const path of pages) {
  test.describe(`Smoke ${path}`, () => {
    test(`loads ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/Samuel Holley|Reclaim by Design/);
      await expect(page.locator('nav')).toBeVisible();
    });

    if (path !== '/') {
      test(`all internal links on ${path} resolve`, async ({ page }) => {
        await page.goto(path);
        const links = await page.locator('a[href^="/"]').all();
        for (const link of links) {
          const href = await link.getAttribute('href');
          if (!href) continue;
          const res = await page.request.get(href);
          expect(res.status()).toBeLessThan(400);
        }
      });
    }
  });
}
