import Form from '../../../components/common/form/Form'
import localStorageService from '../../../services/localStorageService'
import PropTypes from 'prop-types'

const LogOutForm = ({ handleRemoveCurrentUser }) => {
  const handleLogout = async () => {
    localStorageService.removeUser()
    handleRemoveCurrentUser(null)
  }
  return (
    <button onClick={handleLogout}>logout</button>
  )
}

LogOutForm.propTypes = {
  handleRemoveCurrentUser: PropTypes.func.isRequired,
}

export default LogOutForm