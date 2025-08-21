import { useCallback, useEffect, useState } from 'react'
import { login } from '../../services/authService'
import LoginForm from './components/LoginForm'

const LoginView = ({ populateLoggedInUser, handleNotification, handleTitleChange }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    handleTitleChange('login in to application')
  }, [handleTitleChange])

  const handleLogin = useCallback(async (event) => {
    event.preventDefault()
    try {
      const response = await login(username, password)
      console.log(response)
      handleNotification({ message: 'Login successful', type: 'success' })
      populateLoggedInUser(response.data)
    } catch (error) {
      console.log('error', error.response.data.error )
      handleNotification({ message: error.response.data.error, type: 'error' })
    }
  }, [username, password, handleNotification, populateLoggedInUser])

  return <LoginForm handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} />
}

export default LoginView