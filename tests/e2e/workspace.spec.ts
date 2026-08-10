import { expect, test } from "@playwright/test";

test.describe("E2E-02 · 3D workspace loads", () => {
  test("renders without console errors and shows the HUD", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));

    await page.goto("/3d");

    await expect(page).toHaveTitle(/Shreyas Pawar|Workspace|3D/, { timeout: 30_000 });
    await page.waitForTimeout(4_000);

    const hud = page.getByText(/HUD|Help|Settings/i);
    const visible = await hud.count();
    expect(visible).toBeGreaterThan(0);

    expect(errors.filter((e) => !/WebGL|GPU|swiftshader|context lost/i.test(e))).toEqual([]);
  });
});
