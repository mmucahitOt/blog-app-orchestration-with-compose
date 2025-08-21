import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreate from './BlogCreate'
import { expect, test, vi } from 'vitest'

test('blog create form submits with correct data', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogCreate createBlog={createBlog} />)

  // Get form elements
  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('Url:')
  const createButton = screen.getByRole('button', { name: 'Create Blog' })

  // Fill in the form
  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://test.com')

  // Submit the form
  await user.click(createButton)

  // Verify the form submission
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://test.com'
  })
  expect(createBlog).toHaveBeenCalledTimes(1)

  // Verify form is cleared after submission
  expect(titleInput).toHaveValue('')
  expect(authorInput).toHaveValue('')
  expect(urlInput).toHaveValue('')
})