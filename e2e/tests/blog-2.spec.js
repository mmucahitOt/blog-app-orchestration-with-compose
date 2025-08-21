const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith } = require("../helpers/helper");
const mongoose = require("mongoose");

describe("Blog app", () => {
  const user = {
    id: new mongoose.Types.ObjectId().toString(),
    username: "testuser",
    name: "Test User",
    password: "testpassword",
  };

  const blogs = [
    {
      id: new mongoose.Types.ObjectId().toString(),
      title: "Test Blog 1",
      author: "Test Author 1",
      url: "https://test.com",
      userId: user.id,
      likes: 0,
    },
    {
      id: new mongoose.Types.ObjectId().toString(),
      title: "Test Blog 2",
      author: "Test Author 2",
      url: "https://test2.com",
      userId: user.id,
      likes: 1,
    },
    {
      id: new mongoose.Types.ObjectId().toString(),
      title: "Test Blog 3",
      author: "Test Author 3",
      url: "https://test3.com",
      userId: user.id,
      likes: 2,
    },
  ];
  user.blogs = blogs.map((blog) => blog.id);

  beforeEach(async ({ page, request }) => {
    await page.goto("http://localhost:5173");

    // Reset database before each test
    console.log("Resetting database...");
    await request.get("http://localhost:3000/api/testing/reset-database");

    // Create user with blogs
    console.log("Creating user...");
    await request.post("http://localhost:3000/api/testing/create-user", {
      data: {
        username: user.username,
        name: user.name,
        password: user.password,
        id: user.id,
        blogs: user.blogs,
      },
    });

    // Create blogs
    console.log("Creating blogs...");
    for (const blog of blogs) {
      console.log(`Creating blog: ${blog.title} by ${blog.author}`);
      await request.post("http://localhost:3000/api/testing/create-blog", {
        data: {
          title: blog.title,
          author: blog.author,
          url: blog.url,
          userId: user.id,
          id: blog.id,
          likes: blog.likes,
        },
      });
    }

    // Login and wait for page to load
    console.log("Logging in...");
    await loginWith({ page, username: user.username, password: user.password });
    await page.waitForLoadState("networkidle");
    console.log("Login completed");
  });

  describe("When logged in", () => {
    test("Blogs are sorted by likes in descending order", async ({ page }) => {
      console.log("Starting blog sorting test...");

      // Debug: Check what's actually on the page
      console.log("Checking page content...");
      const pageContent = await page.content();
      console.log("Page content length:", pageContent.length);

      // Debug: Check if we're on the right page
      const heading = page.getByRole("heading", { name: "blogs" });
      const headingVisible = await heading.isVisible();
      console.log("Blogs heading visible:", headingVisible);

      // Debug: Check for any blog-related content
      const allText = await page.textContent("body");
      console.log("Page text content:", allText.substring(0, 500) + "...");

      // Wait for all blog titles to be visible (title + author format)
      console.log("Looking for blog titles with author...");
      const blogTitles = page.getByText(/Test Blog \d Test Author \d/);
      console.log(
        "Found blog titles with author count:",
        await blogTitles.count()
      );
      await expect(blogTitles).toHaveCount(blogs.length, { timeout: 10000 });

      // Click view button for each blog to expand them
      for (let i = 0; i < blogs.length; i++) {
        // Get all view buttons (including both "view" and "hide" buttons)
        const viewButtons = page
          .getByRole("button")
          .filter({ hasText: /view|hide/ });

        // Click the current button (should be in order)
        const currentButton = viewButtons.nth(i);
        await currentButton.waitFor({ state: "visible", timeout: 10000 });
        await currentButton.click();
        await page.waitForLoadState("networkidle");
      }

      // Get all like counts after expanding
      const likeCounts = page.getByText(/^[0-2]$/); // Matches 0, 1, or 2
      await expect(likeCounts).toHaveCount(blogs.length, { timeout: 10000 });

      // Verify blogs are sorted by likes (descending)
      // Blog 3 should be first (2 likes)
      await expect(blogTitles.nth(0)).toContainText(
        `${blogs[2].title} ${blogs[2].author}`,
        {
          timeout: 10000,
        }
      );
      await expect(likeCounts.nth(0)).toHaveText("2", { timeout: 10000 });

      // Blog 2 should be second (1 like)
      await expect(blogTitles.nth(1)).toContainText(
        `${blogs[1].title} ${blogs[1].author}`,
        {
          timeout: 10000,
        }
      );
      await expect(likeCounts.nth(1)).toHaveText("1", { timeout: 10000 });

      // Blog 1 should be last (0 likes)
      await expect(blogTitles.nth(2)).toContainText(
        `${blogs[0].title} ${blogs[0].author}`,
        {
          timeout: 10000,
        }
      );
      await expect(likeCounts.nth(2)).toHaveText("0", { timeout: 10000 });
    });
  });
});
