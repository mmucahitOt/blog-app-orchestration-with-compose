const getUser = () => {
  const user = window.localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

const setUser = (user) => {
  window.localStorage.setItem('user', JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem('user')
}

export default { getUser, setUser, removeUser }
