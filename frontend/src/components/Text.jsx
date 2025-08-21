const Text = ({
  text,
  as = 'div',
  style = {},
  ...props
}) => {
  const Tag = as
  return (
    <Tag style={style} {...props}>
      {text}
    </Tag>
  )
}

export default Text