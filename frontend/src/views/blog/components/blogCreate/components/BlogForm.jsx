import Form from '../../../../../components/common/form/Form'
import FormInput from '../../../../../components/common/form/FormInput'
import PropTypes from 'prop-types'

const BlogForm = ({ formTitle, formProps, buttonText, buttonProps, title, author, url, setTitle, setAuthor, setUrl }) => {
  return (
    <div>
      <Form formTitle={formTitle} formProps={formProps} buttonText={buttonText} buttonProps={buttonProps}>
        <FormInput
          inputDivProps={{ className: 'form-group' }}
          inputProps={{
            label: 'Title: ',
            type: 'text',
            name: 'title',
            value: title,
            onChange: ({ target }) => setTitle(target.value),
            'aria-label': 'Title'
          }}
        />
        <FormInput
          inputDivProps={{ className: 'form-group' }}
          inputProps={{
            label: 'Author: ',
            type: 'text',
            name: 'author',
            value: author,
            onChange: ({ target }) => setAuthor(target.value),
            'aria-label': 'Author'
          }}
        />
        <FormInput
          inputDivProps={{ className: 'form-group' }}
          inputProps={{
            label: 'Url: ',
            type: 'text',
            name: 'url',
            value: url,
            onChange: ({ target }) => setUrl(target.value),
            'aria-label': 'Url'
          }}
        />
      </Form>
    </div>
  )
}

BlogForm.propTypes = {
  buttonText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  setAuthor: PropTypes.func.isRequired,
  setUrl: PropTypes.func.isRequired,
}

export default BlogForm