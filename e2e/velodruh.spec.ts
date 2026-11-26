import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const VIDEOS_DIR = path.resolve(process.cwd(), "e2e-videos");

test.afterEach(async ({ page }, testInfo) => {
  const video = page.video();
  if (!video) return;

  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  await page.close();

  const destPath = path.join(VIDEOS_DIR, `e2e-flow-${testInfo.project.name}.webm`);
  await video.saveAs(destPath);
});

test("VeloDruh E2E flow: home -> wizard -> catalog -> bike detail", async ({
  page,
}) => {
  // 1. Home page
  await page.goto("/");
  await expect(page).toHaveTitle(/VeloDruh/i);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Знайдіть свій ідеальний велосипед/i,
    }),
  ).toBeVisible();

  // Navigate to the 5-step bike wizard
  await page.getByRole("link", { name: "Пройти опитувальник" }).click();
  await expect(page).toHaveURL(/\/wizard$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Підбір велосипеда" }),
  ).toBeVisible();

  // 2. Wizard Step 1: Rider parameters
  await expect(
    page.getByRole("heading", { level: 2, name: /1\. Фізичні параметри/i }),
  ).toBeVisible();
  await page.locator('input[type="range"]').first().fill("178");
  await page.getByRole("button", { name: "Унісекс" }).click();
  await page.getByRole("button", { name: "Далі" }).click();

  // 3. Wizard Step 2: Budget
  await expect(
    page.getByRole("heading", { level: 2, name: /2\. Бюджет/i }),
  ).toBeVisible();
  const budgetInputs = page.locator('input[type="number"]');
  await expect(budgetInputs).toHaveCount(2);
  await budgetInputs.nth(0).fill("10000");
  await budgetInputs.nth(1).fill("80000");
  await page.getByRole("button", { name: "Далі" }).click();

  // 4. Wizard Step 3: Surface & usage
  await expect(
    page.getByRole("heading", { level: 2, name: /3\. Покриття катання/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Далі" }).click();

  // 5. Wizard Step 4: Optional required features
  await expect(
    page.getByRole("heading", { level: 2, name: /4\. Обов'язкові опції/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Далі" }).click();

  // 6. Wizard Step 5: Review & submit
  await expect(
    page.getByRole("heading", { level: 2, name: /5\. Перевірте дані/i }),
  ).toBeVisible();
  await expect(page.getByText(/178 см/)).toBeVisible();
  await page.getByRole("button", { name: "Отримати рекомендації" }).click();

  // 7. Wizard evaluation results
  await expect(page.getByText("Рекомендований клас велосипеда")).toBeVisible();
  await expect(page.getByText("Розмір рами").first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Параметри підібраного велосипеда" }),
  ).toBeVisible();

  // Proceed to catalog with recommended filters
  const searchCatalogButton = page.getByRole("button", {
    name: "Шукати в каталозі VeloDruh",
  });
  await searchCatalogButton.scrollIntoViewIfNeeded();
  await searchCatalogButton.click();

  // 8. Catalog page
  await expect(page).toHaveURL(/\/bikes/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Каталог велосипедів" }),
  ).toBeVisible();
  await expect(page.getByText(/Знайдено:/)).toBeVisible();

  const detailLinks = page.getByRole("link", { name: /Повна картка та ціни/i });
  const emptyState = page.getByText(
    /За заданими параметрами велосипедів не знайдено/i,
  );

  // Wait until either bike cards or empty state renders
  await expect(detailLinks.first().or(emptyState)).toBeVisible();

  // If the wizard's exact filters have no matches, reset filters to browse all bikes
  if ((await detailLinks.count()) === 0) {
    const resetButton = page.getByRole("button", { name: "Скинути" });
    await resetButton.scrollIntoViewIfNeeded();
    await resetButton.click();
    await expect(detailLinks.first()).toBeVisible();
  }

  // 9. Open first bike detail page
  const firstBikeLink = detailLinks.first();
  await firstBikeLink.scrollIntoViewIfNeeded();
  await firstBikeLink.click();

  await expect(page).toHaveURL(/\/bikes\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Характеристики" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Розміри та пропозиції магазинів",
    }),
  ).toBeVisible();

  const shopLinks = page.getByRole("link", { name: "Перейти в магазин" });
  await shopLinks.first().scrollIntoViewIfNeeded();
  await expect(shopLinks.first()).toBeVisible();

  // 10. Navigate back to catalog
  const backLink = page.getByRole("link", { name: /Назад до каталогу/i });
  await backLink.scrollIntoViewIfNeeded();
  await backLink.click();
  await expect(page).toHaveURL(/\/bikes$/);
});
