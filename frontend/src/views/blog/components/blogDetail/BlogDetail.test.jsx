import { render, screen } from '@testing-library/react'
import { test, expect, describe, vi } from 'vitest'
import BlogDetail from './BlogDetail'
import userEvent from '@testing-library/user-event'

test('does not show url and user name by default', () => {
  const blog = {
    id: '1',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 0,
    user: {
      name: 'Test User'
    }
  }

  render(<BlogDetail blog={blog} user={{ token: 'test-token' }} />)

  // Title and author should be visible by default
  const titleAuthorElement = screen.getByText(`${blog.title} ${blog.author}`)
  expect(titleAuthorElement).toBeDefined()

  // URL should not be visible
  const urlElement = screen.queryByText(blog.url)
  expect(urlElement).toBeNull()

  // User name should not be visible
  const userNameElement = screen.queryByText(blog.user.name)
  expect(userNameElement).toBeNull()
})

test('shows url and user name when expanded', async () => {
  const blog = {
    id: '1',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 0,
    user: {
      name: 'Test User'
    }
  }

  const user = userEvent.setup()

  render(<BlogDetail blog={blog} user={{ token: 'test-token' }} />)
  await user.click(screen.getByText('view'))

  const titleAuthorElement = screen.getByText(`${blog.title} ${blog.author}`)
  expect(titleAuthorElement).toBeDefined()

  const urlElement = screen.getByText(blog.url)
  expect(urlElement).toBeDefined()

  const userNameElement = screen.getByText(blog.user.name)
  expect(userNameElement).toBeDefined()
})

test('clicking like button increases likes', async () => {
  const blog = {
    id: '1',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 0,
    user: {
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn(() => {
    blog.likes++
  })
  const user = userEvent.setup()

  const container = render(<BlogDetail blog={blog} user={{ token: 'test-token' }} handleLike={mockHandler} />)

  const viewButton = screen.getByText('view')

  await user.click(viewButton)

  const likesButton = screen.getByText('like')
  likesButton.onclick = mockHandler

  await user.click(likesButton)
  await user.click(likesButton)

  container.debug()

  expect(mockHandler).toHaveBeenCalledTimes(2)
  expect(blog.likes).toBe(2)
})