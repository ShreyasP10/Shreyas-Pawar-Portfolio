import { expect, test } from "@playwright/test";

test.describe("E2E-01 · 2D portfolio renders", () => {
  test("home page shows the hero and nav", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("header nav, nav")).toBeVisible();

    expect(errors).toEqual([]);
  });
});
