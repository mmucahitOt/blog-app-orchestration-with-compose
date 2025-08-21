import PropTypes from 'prop-types'

const FormInput = ({ inputDivProps, inputProps }) => {
  const { label, ...restInputProps } = inputProps
  const inputId = `input-${restInputProps.name}`

  return (
    <div {...inputDivProps}>
      <label htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        {...restInputProps}
      />
    </div>
  )
}

FormInput.propTypes = {
  inputDivProps: PropTypes.object,
  inputProps: PropTypes.shape({
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }).isRequired
}

export default FormInput
