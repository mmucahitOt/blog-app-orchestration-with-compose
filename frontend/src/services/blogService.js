import axios from 'axios'
import generateURL from './serviceConfig'

const BLOG_API_URL = generateURL('api', 'blogs')

export const getAll = async (token) => {
  const response = await axios.get(BLOG_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const createBlog = async ({ token, title, author, url }) => {
  const response = await axios.post(
    BLOG_API_URL,
    { title, author, url: url },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

export const updateBlog = async ({ token, id, updateOptions }) => {
  console.log('updateOptions', updateOptions)
  const response = await axios.put(BLOG_API_URL + '/' + id, updateOptions, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export const deleteBlog = async ({ token, id }) => {
  const response = await axios.delete(BLOG_API_URL + '/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const likeBlog = async ({ token, id }) => {
  const response = await axios.put(BLOG_API_URL + '/like/' + id, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
