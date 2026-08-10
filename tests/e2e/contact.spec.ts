import { expect, test } from "@playwright/test";

const VALID_BODY = {
  name: "Shreyas Pawar",
  email: "shreyaspawar1011@gmail.com",
  message: "Hello, this is a valid test message.",
};

test.describe("E2E-08 · contact API", () => {
  test("accepts a valid payload", async ({ request }) => {
    const res = await request.post("/api/contact", { data: VALID_BODY });
    if (process.env.RESEND_API_KEY) {
      expect([200, 502]).toContain(res.status());
    } else {
      expect(res.status()).toBe(200);
    }
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("rejects an invalid payload with 400", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { name: "S", email: "bad", message: "short" },
    });
    expect(res.status()).toBe(400);
  });
});
