import React from 'react'
import { Form, FormGroup, Button } from 'react-bootstrap'

interface HeaderProps {
  setActiveUser: (user: string) => void
}

const Header: React.FC<HeaderProps> = props => {
  const { setActiveUser } = props
  const [userEmail, setUserEmail] = React.useState('')

  const formSubmit = async (e: React.FormEvent) => {
    // prevent default
    e.preventDefault()

    if (!userEmail.includes('telus')) {
      alert('input does not include @telus.net email')
      return
    }

    setActiveUser(userEmail)
    setUserEmail('')
  }

  return (
    <>
      <div className='header-container'>
        <p>
          This tool is intended to provide details about a customer’s mailbox
          for query and research purposes only, as well as assist with some
          login issues. It can provide insights regarding to the status of the
          account, aliases, security mechanisms in use, and mailbox usage,
          including the potential use of third party applications (POP/IMAP). To
          address sign in issues, you can also remove all recovery information
          for users who have never been able to sign in, reset sign in cookies
          for users and unsuspend users.
        </p>
        <p>Enter the email address you wish to search for:</p>
      </div>
      <Form id='submitForm' onSubmit={formSubmit}>
        <FormGroup>
          <input
            type='email'
            value={userEmail}
            id='myInput'
            className='form-control mb-2'
            placeholder='Enter email address...'
            onChange={e => setUserEmail(e.target.value)}
          />
          <Button
            type='submit'
            disabled={!userEmail}
            className='btn btn-primary ml-2'
          >
            Search
          </Button>
        </FormGroup>
      </Form>
    </>
  )
}

export default Header
