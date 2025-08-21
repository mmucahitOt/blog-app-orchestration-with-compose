
import { useState, useEffect } from 'react'
import localStorageService from './services/localStorageService'
import LoginView from './views/login/LoginView'
import Notification from './components/Notification'
import BlogView from './views/blog/BlogView'
import LogoutForm from './views/login/components/LogoutForm'
import Text from './components/Text'

const App = () => {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState()
  const [notification, setNotification] = useState()

  useEffect(() => {
    const user = localStorageService.getUser()
    console.log('local storage user', user)
    if (user) {
      setUser(user)
    }
  }, [])

  const populateLoggedInUser = (user) => {
    setUser(user)
    localStorageService.setUser(user)
  }

  const handleUserLogout = () => {
    setUser(null)
  }

  const handleTitleChange = (title) => {
    setTitle(title)
  }

  const handleNotification = (notification) => {
    setNotification(notification)
  }

  return (
    <div>
      <h3>{title}</h3>
      <Notification message={notification?.message} type={notification?.type} />

      {user && <Text style={{ marginBottom: '10px' }} text={user.username + ' logged in'} />}
      {user && <LogoutForm handleRemoveCurrentUser={handleUserLogout} />}

      {!user && <LoginView populateLoggedInUser={populateLoggedInUser} handleTitleChange={handleTitleChange} handleNotification={handleNotification} />}
      {user &&<BlogView user={user} handleTitleChange={handleTitleChange} handleNotification={handleNotification} />}
    </div>
  )
}

export default App