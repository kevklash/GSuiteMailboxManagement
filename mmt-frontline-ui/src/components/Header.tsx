import React from 'react'
import Swal from 'sweetalert2'
import { Form, FormGroup, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

interface HeaderProps {
  setActiveUser: (user: string) => void
}

const Header: React.FC<HeaderProps> = props => {
  const { setActiveUser } = props
  const [userEmail, setUserEmail] = React.useState('')
  const { t } = useTranslation()

  const formSubmit = async (e: React.FormEvent) => {
    // prevent default
    e.preventDefault()

    if (!userEmail.includes('telus')) {
      Swal.fire({
        title: t("not_telus_confirm"), 
        text: t("Please include a valid Telus domain"),
        icon: 'warning', 
      })

    console.log('input does not include @telus.net email')
      return
    }

    setActiveUser(userEmail)
    setUserEmail('')
  }

  return (
    <>
      <div className='header-container'>
        <p>
        {t("description")}
        </p>
        <p>{t("input_label")}</p>
      </div>
      <Form id='submitForm' onSubmit={formSubmit}>
        <FormGroup>
          <input
            type='email'
            value={userEmail}
            id='myInput'
            className='form-control mb-2'
            placeholder={t("input_placeholder")}
            onChange={e => setUserEmail(e.target.value)}
          />
          <Button
            type='submit'
            disabled={!userEmail}
            className='btn btn-primary ml-2'
          >
            {t("search_button")}
          </Button>
        </FormGroup>
      </Form>
    </>
  )
}

export default Header
