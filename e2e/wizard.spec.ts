import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import type { BikeListResponse, WizardEvaluateResponse } from "../app/lib/api-types";

const VIDEOS_DIR = path.resolve(process.cwd(), "e2e-videos");

const WIZARD_INPUT = {
  heightCm: 178,
  inseamCm: 83,
  minPriceUah: 10000,
  maxPriceUah: 80000,
} as const;

test.afterEach(async ({ page }, testInfo) => {
  const video = page.video();
  if (!video) return;

  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  await page.close();

  const destPath = path.join(VIDEOS_DIR, `wizard-${testInfo.project.name}.webm`);
  await video.saveAs(destPath);
});

test("completes the 5-step wizard and verifies returned recommendations and bike options", async ({
  page,
}) => {
  // 1. Open home page and enter the wizard
  await page.goto("/");
  await expect(page).toHaveTitle(/VeloDruh/i);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Знайдіть свій ідеальний велосипед/i,
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Пройти опитувальник" }).click();
  await expect(page).toHaveURL(/\/wizard$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Підбір велосипеда" }),
  ).toBeVisible();

  // 2. Step 1: Rider parameters (height, optional inseam, gender)
  await expect(
    page.getByRole("heading", { level: 2, name: /1\. Фізичні параметри/i }),
  ).toBeVisible();
  const riderSliders = page.locator('input[type="range"]');
  await expect(riderSliders).toHaveCount(2);
  await riderSliders.nth(0).fill(String(WIZARD_INPUT.heightCm));
  await riderSliders.nth(1).fill(String(WIZARD_INPUT.inseamCm));
  await expect(page.getByText(`${WIZARD_INPUT.heightCm} см`)).toBeVisible();
  await expect(page.getByText(`${WIZARD_INPUT.inseamCm} см`)).toBeVisible();

  await page.getByRole("button", { name: "Унісекс" }).click();
  await page.getByRole("button", { name: "Далі" }).click();

  // 3. Step 2: Budget
  await expect(
    page.getByRole("heading", { level: 2, name: /2\. Бюджет/i }),
  ).toBeVisible();
  const budgetInputs = page.locator('input[type="number"]');
  await expect(budgetInputs).toHaveCount(2);
  await budgetInputs.nth(0).fill(String(WIZARD_INPUT.minPriceUah));
  await budgetInputs.nth(1).fill(String(WIZARD_INPUT.maxPriceUah));
  await page.getByRole("button", { name: "Далі" }).click();

  // 4. Step 3: Surface proportions, riding position & primary goal
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /3\. Покриття катання та мета \(разом 100%\)/i,
    }),
  ).toBeVisible();
  const usageSelects = page.locator("select");
  await expect(usageSelects).toHaveCount(2);
  await usageSelects.nth(0).selectOption("COMFORTABLE");
  await usageSelects.nth(1).selectOption("commuting");
  await page.getByRole("button", { name: "Далі" }).click();

  // 5. Step 4: Required features
  await expect(
    page.getByRole("heading", { level: 2, name: /4\. Обов'язкові опції/i }),
  ).toBeVisible();
  const discBrakesOption = page.getByLabel("Дискові гальма");
  await discBrakesOption.check();
  await expect(discBrakesOption).toBeChecked();
  await page.getByRole("button", { name: "Далі" }).click();

  // 6. Step 5: Review summary & submit wizard
  await expect(
    page.getByRole("heading", { level: 2, name: /5\. Перевірте дані/i }),
  ).toBeVisible();
  await expect(
    page.getByText(`${WIZARD_INPUT.heightCm} см / ${WIZARD_INPUT.inseamCm} см`),
  ).toBeVisible();
  await expect(page.getByText("UNISEX")).toBeVisible();
  await expect(page.getByText(/10[\s\u00a0]000–80[\s\u00a0]000 UAH/)).toBeVisible();
  await expect(
    page.getByText("Асфальт 60% · Гравій 30% · Бездоріжжя 10%"),
  ).toBeVisible();
  await expect(page.getByText("Дискові гальма")).toBeVisible();

  const evaluateResponsePromise = page.waitForResponse(
    (res) =>
      res.url().includes("/api/v1/wizard/evaluate") &&
      res.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Отримати рекомендації" }).click();
  const evaluateResponse = await evaluateResponsePromise;
  expect(evaluateResponse.status()).toBe(200);

  const evaluation = (await evaluateResponse.json()) as WizardEvaluateResponse;
  expect(evaluation.analysis.recommendedCategory.type).toBe("GRAVEL");
  expect(evaluation.analysis.calculatedFrameSize.standardLabel).toBe("M");
  expect(evaluation.analysis.calculatedFrameSize.confidence).toBe("HIGH");
  expect(evaluation.recommendedFilters).toMatchObject({
    category: "GRAVEL",
    sizeLabel: "M",
    riderHeightCm: WIZARD_INPUT.heightCm,
    gender: "UNISEX",
    minPriceUah: WIZARD_INPUT.minPriceUah,
    maxPriceUah: WIZARD_INPUT.maxPriceUah,
    ridingPosition: "COMFORTABLE",
    brakeTypes: ["HYDRAULIC_DISC", "MECHANICAL_DISC"],
    inStockOnly: true,
  });

  // 7. Verify rendered wizard recommendations and pre-filled filter options
  await expect(page.getByText("Рекомендований клас велосипеда")).toBeVisible();
  await expect(
    page.getByText(evaluation.analysis.recommendedCategory.displayName),
  ).toBeVisible();
  await expect(page.getByText("Розмір рами").first()).toBeVisible();
  await expect(
    page.getByText(
      `${evaluation.analysis.calculatedFrameSize.standardLabel} (${evaluation.analysis.calculatedFrameSize.numericSize} ${evaluation.analysis.calculatedFrameSize.unit})`,
    ),
  ).toBeVisible();
  await expect(page.getByText("Точність: висока")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Параметри підібраного велосипеда" }),
  ).toBeVisible();
  await expect(page.getByLabel("Категорія")).toHaveValue("GRAVEL");
  await expect(page.getByLabel("Розмір рами")).toHaveValue("M");
  await expect(page.getByLabel("Зріст райдера (см)")).toHaveValue(
    String(WIZARD_INPUT.heightCm),
  );
  await expect(page.getByLabel("Стать")).toHaveValue("UNISEX");
  await expect(page.getByLabel("Ціна від")).toHaveValue(
    String(WIZARD_INPUT.minPriceUah),
  );
  await expect(page.getByLabel("Ціна до")).toHaveValue(
    String(WIZARD_INPUT.maxPriceUah),
  );
  await expect(page.getByLabel("Посадка")).toHaveValue("COMFORTABLE");
  await expect(page.getByLabel("Тільки в наявності")).toBeChecked();
  await expect(page.getByLabel("Гідравлічні дискові")).toBeChecked();
  await expect(page.getByLabel("Механічні дискові")).toBeChecked();
  await expect(page.getByLabel("Ободні")).not.toBeChecked();

  // 8. Navigate to catalog with recommended filters and verify returned bike options
  const bikesResponsePromise = page.waitForResponse(
    (res) =>
      res.url().includes("/api/v1/bikes") && res.request().method() === "GET",
  );
  const searchCatalogButton = page.getByRole("button", {
    name: "Шукати в каталозі VeloDruh",
  });
  await searchCatalogButton.scrollIntoViewIfNeeded();
  await searchCatalogButton.click();

  const bikesResponse = await bikesResponsePromise;
  expect(bikesResponse.status()).toBe(200);
  const bikesData = (await bikesResponse.json()) as BikeListResponse;
  expect(bikesData.total).toBeGreaterThan(0);
  expect(bikesData.items.length).toBeGreaterThan(0);

  await expect(page).toHaveURL(/\/bikes\?/);
  const catalogUrl = new URL(page.url());
  expect(catalogUrl.searchParams.get("category")).toBe("GRAVEL");
  expect(catalogUrl.searchParams.get("sizeLabel")).toBe("M");
  expect(catalogUrl.searchParams.get("riderHeightCm")).toBe(
    String(WIZARD_INPUT.heightCm),
  );
  expect(catalogUrl.searchParams.get("minPriceUah")).toBe(
    String(WIZARD_INPUT.minPriceUah),
  );
  expect(catalogUrl.searchParams.get("maxPriceUah")).toBe(
    String(WIZARD_INPUT.maxPriceUah),
  );
  expect(catalogUrl.searchParams.get("brakeType")).toBe(
    "HYDRAULIC_DISC,MECHANICAL_DISC",
  );
  expect(catalogUrl.searchParams.get("inStockOnly")).toBe("true");

  await expect(
    page.getByRole("heading", { level: 1, name: "Каталог велосипедів" }),
  ).toBeVisible();
  await expect(page.getByText(`Знайдено: ${bikesData.total}`)).toBeVisible();
  await expect(
    page.getByText(/За заданими параметрами велосипедів не знайдено/i),
  ).toHaveCount(0);

  // Verify the FilterPanel preserved wizard filters
  await expect(page.getByLabel("Категорія")).toHaveValue("GRAVEL");
  await expect(page.getByLabel("Розмір рами")).toHaveValue("M");
  await expect(page.getByLabel("Гідравлічні дискові")).toBeChecked();
  await expect(page.getByLabel("Механічні дискові")).toBeChecked();

  // Verify every returned bike option card matches the API results & wizard constraints
  const bikeCards = page.locator("article");
  await expect(bikeCards).toHaveCount(bikesData.items.length);

  for (let i = 0; i < bikesData.items.length; i++) {
    const expectedBike = bikesData.items[i]!;
    const card = bikeCards.nth(i);

    if (i === 0) {
      await card.scrollIntoViewIfNeeded();
    }

    expect(expectedBike.category).toBe("GRAVEL");
    expect(expectedBike.bestPriceUah).toBeGreaterThanOrEqual(
      WIZARD_INPUT.minPriceUah,
    );
    expect(expectedBike.bestPriceUah).toBeLessThanOrEqual(
      WIZARD_INPUT.maxPriceUah,
    );
    expect(["HYDRAULIC_DISC", "MECHANICAL_DISC"]).toContain(
      expectedBike.specs.brakeType,
    );

    await expect(
      card.getByRole("heading", { level: 3, name: expectedBike.name }),
    ).toBeVisible();
    await expect(card.getByText(/GRAVEL/)).toBeVisible();
    await expect(card.getByText(/₴/)).toBeVisible();
    await expect(card.getByText(/\d+ пропозицій/)).toBeVisible();
    await expect(
      card.getByRole("link", { name: /Повна картка та ціни/i }),
    ).toHaveAttribute("href", `/bikes/${expectedBike.slug}`);
  }

  // 9. Open the first returned option and verify its bike detail page
  const firstBike = bikesData.items[0]!;
  const firstDetailLink = bikeCards
    .first()
    .getByRole("link", { name: /Повна картка та ціни/i });
  await firstDetailLink.scrollIntoViewIfNeeded();
  await firstDetailLink.click();

  await expect(page).toHaveURL(new RegExp(`/bikes/${firstBike.slug}$`));
  await expect(
    page.getByRole("heading", { level: 1, name: firstBike.name }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Характеристики" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Розміри та пропозиції магазинів",
    }),
  ).toBeVisible();

  const shopLink = page.getByRole("link", { name: "Перейти в магазин" }).first();
  await shopLink.scrollIntoViewIfNeeded();
  await expect(shopLink).toBeVisible();
});
