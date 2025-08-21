const {
  test,
  expect,
  beforeEach,
  describe,
  afterEach,
} = require("@playwright/test");

describe("Blog app", () => {
  const user = {
    username: "testuser",
    name: "Test User",
    password: "testpassword",
  };
  beforeEach(async ({ page, request }) => {
    await page.goto("http://localhost:5173");
    await request.post("http://localhost:3000/api/testing/create-user", {
      data: {
        username: user.username,
        name: user.name,
        password: user.password,
      },
    });
  });

  afterEach(async ({ page, request }) => {
    await request.get("http://localhost:3000/api/testing/reset-database");
  });

  test("Login form is shown", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const locator = page.getByRole("heading", { name: /Login/ });
    await expect(locator).toBeVisible({ timeout: 10000 });
  });

  describe("Login", () => {
    test("Login with valid credentials", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      // Wait for and fill username
      const usernameInput = page.getByRole("textbox", { name: "Username" });
      await usernameInput.waitFor({ state: "visible", timeout: 10000 });
      await usernameInput.fill(user.username);

      // Wait for and fill password
      const passwordInput = page.getByRole("textbox", { name: "Password" });
      await passwordInput.waitFor({ state: "visible", timeout: 10000 });
      await passwordInput.fill(user.password);

      // Wait for and click login button
      const loginButton = page.getByRole("button", { name: "Login" });
      await loginButton.waitFor({ state: "visible", timeout: 10000 });
      await expect(loginButton).toBeEnabled();
      await loginButton.click();

      // Wait for navigation and verify login success
      await page.waitForLoadState("networkidle");
      await page.waitForLoadState("domcontentloaded");

      const blogsHeading = page.getByRole("heading", { name: "Blogs" });
      await expect(blogsHeading).toBeVisible({ timeout: 10000 });
    });

    test("Login with invalid credentials", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const usernameInput = page.getByRole("textbox", { name: "Username" });
      await usernameInput.waitFor({ state: "visible", timeout: 10000 });
      await usernameInput.fill(user.username);

      const passwordInput = page.getByRole("textbox", { name: "Password" });
      await passwordInput.waitFor({ state: "visible", timeout: 10000 });
      await passwordInput.fill("invalid");

      const loginButton = page.getByRole("button", { name: "Login" });
      await loginButton.waitFor({ state: "visible", timeout: 10000 });
      await expect(loginButton).toBeEnabled();
      await loginButton.click();

      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("heading", { name: /Login/ })).toBeVisible({
        timeout: 10000,
      });
    });
  });
});
