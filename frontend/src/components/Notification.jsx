import { useEffect, useState } from 'react'

const Notification = (props) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (props) {
      setVisible(true)
      setTimeout(() => {
        setVisible(false)
      }, 2000)
    }
  }, [props])

  if (!visible || !props.message || !props.type) {
    return null
  }

  return (
    <div
      style={{
        color: props.type === 'error' ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      {props.message}
    </div>
  )
}

export default Notification
