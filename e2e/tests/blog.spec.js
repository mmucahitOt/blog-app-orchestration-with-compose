const {
  test,
  expect,
  beforeEach,
  describe,
  afterEach,
} = require("@playwright/test");
const {
  createBlog,
  loginWith,
  clearLocalStorage,
} = require("../helpers/helper");

describe("Blog app", () => {
  const user = {
    username: "testuser",
    name: "Test User",
    password: "testpassword",
  };

  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    url: "https://test.com",
  };

  beforeEach(async ({ page, request }) => {
    await page.goto("http://localhost:5173");
    await request.get("http://localhost:3000/api/testing/reset-database");
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

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith({
        page,
        username: user.username,
        password: user.password,
      });
      await page.waitForLoadState("networkidle");
    });

    test("A blog can be created", async ({ page }) => {
      await createBlog({ page, blog: newBlog });

      await expect(page.getByText(newBlog.title)).toBeVisible({
        timeout: 10000,
      });
    });

    test("A blog can be liked", async ({ page }) => {
      // First create a blog
      await createBlog({ page, blog: newBlog });

      // Wait for the blog to be visible
      await expect(page.getByText(newBlog.title)).toBeVisible({
        timeout: 10000,
      });

      // Find the specific blog's view button by looking for the blog title first
      const blogContainer = page
        .locator("div")
        .filter({ hasText: newBlog.title })
        .first();
      const viewButton = blogContainer.getByRole("button", { name: "view" });
      await viewButton.waitFor({ state: "visible", timeout: 10000 });
      await viewButton.click();

      const likeButton = page.getByRole("button", { name: "like" });
      await likeButton.waitFor({ state: "visible", timeout: 10000 });
      await likeButton.click();

      await page.waitForLoadState("networkidle");
      await expect(page.getByText("1")).toBeVisible({ timeout: 10000 });
    });

    test("Delete button is not visible for other users", async ({
      page,
      request,
    }) => {
      const user2 = {
        username: "testuser2",
        name: "Test User 2",
        password: "testpassword",
      };

      // Create second user
      await request.post("http://localhost:3000/api/testing/create-user", {
        data: {
          username: user2.username,
          name: user2.name,
          password: user2.password,
        },
      });

      // Create a blog as the first user
      await createBlog({ page, blog: newBlog });

      await page.waitForLoadState("networkidle");

      // Log in as second user
      await clearLocalStorage(page);
      await page.goto("http://localhost:5173");
      await loginWith({
        page,
        username: user2.username,
        password: user2.password,
      });

      await page.waitForLoadState("networkidle");
      await page.waitForLoadState("domcontentloaded");

      // First verify the blog title is visible
      await expect(page.getByText(newBlog.title)).toBeVisible({
        timeout: 10000,
      });

      // Then click view to expand the blog details - find the specific blog's view button
      const blogContainer = page
        .locator("div")
        .filter({ hasText: newBlog.title })
        .first();
      const viewButton = blogContainer.getByRole("button", { name: "view" });
      await viewButton.waitFor({ state: "visible", timeout: 10000 });
      await viewButton.click();

      // Now check that the delete button is not visible after expanding
      await expect(
        page.getByRole("button", { name: "delete" })
      ).not.toBeVisible({ timeout: 10000 });
    });

    test("A blog can be deleted", async ({ page }) => {
      // First create a blog
      await createBlog({ page, blog: newBlog });

      // Wait for the blog to be visible
      await expect(page.getByText(newBlog.title)).toBeVisible({
        timeout: 10000,
      });

      // Find the specific blog's view button
      const blogContainer = page
        .locator("div")
        .filter({ hasText: newBlog.title })
        .first();
      const viewButton = blogContainer.getByRole("button", { name: "view" });
      await viewButton.waitFor({ state: "visible", timeout: 10000 });
      await viewButton.click();

      // Set up dialog handler before clicking delete
      page.on("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        await dialog.accept();
      });

      const deleteButton = page.getByRole("button", { name: "delete" });
      await deleteButton.waitFor({ state: "visible", timeout: 10000 });
      await deleteButton.click();

      await page.waitForLoadState("networkidle", { timeout: 10000 });
      await expect(page.getByText(newBlog.title)).not.toBeVisible({
        timeout: 10000,
      });
    });
  });
});
