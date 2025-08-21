const createBlog = async ({ page, blog }) => {
  await page.getByRole("button", { name: "New blog" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill(blog.title);
  await page.getByRole("textbox", { name: "Author" }).fill(blog.author);
  await page.getByRole("textbox", { name: "Url" }).fill(blog.url);
  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForLoadState("networkidle", { timeout: 1000 });
  await page.getByRole("button", { name: "Cancel" }).click();
};

const loginWith = async ({ page, username, password }) => {
  await page.getByRole("textbox", { name: "Username" }).fill(username);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

const clearLocalStorage = async (page) => {
  await page.evaluate(() => {
    window.localStorage.clear();
  });
};

module.exports = { createBlog, loginWith, clearLocalStorage };
