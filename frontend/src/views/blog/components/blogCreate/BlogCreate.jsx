import { useState } from 'react'
import { createBlog } from '../../../../services/blogService'
import BlogForm from './components/BlogForm'

const BlogCreate = ({ user, refetchBlogs, handleNotification, createBlog: propCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async(event) => {
    event.preventDefault()

    if (propCreateBlog) {
      propCreateBlog({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
      return
    }

    try {
      const response = await createBlog({ token: user.token, title, author, url })
      console.log(response)
      await refetchBlogs()
      handleNotification({ message: 'Blog created successfully', type: 'success' })
      // Clear form after successful submission
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.error || 'Failed to create blog'
      handleNotification({ message: errorMessage, type: 'error' })
    }
  }

  return (
    <BlogForm
      formTitle='Create Blog'
      formProps={{ onSubmit: handleCreateBlog }}
      buttonText='Create Blog'
      buttonProps={{ type: 'submit' }}
      title={title}
      author={author}
      url={url}
      setTitle={setTitle}
      setAuthor={setAuthor}
      setUrl={setUrl}/>
  )
}

export default BlogCreate