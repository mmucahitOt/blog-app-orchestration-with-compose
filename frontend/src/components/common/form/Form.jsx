const Form = ({ children, formTitle, formProps, buttonText, buttonProps }) => {
  return (
    <div>
      <form {...formProps}>
        <h3>{formTitle}</h3>
        {children}
        <div>
          <button type='submit' {...buttonProps}>{buttonText}</button>
        </div>
      </form>
    </div>
  )
}

export default Form