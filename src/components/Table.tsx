import React from 'react'
import Swal from 'sweetalert2'
import { Table, Button } from 'react-bootstrap'
import { DataObj } from '../types/APItypes'

interface UserTableProps {
  activeUser: string
  onDataRevalidate: () => void
  data: DataObj
  idx: string
}

const UserTable: React.FC<UserTableProps> = props => {
  const { activeUser, onDataRevalidate } = props

  const {
    primaryEmail,
    lastLoginTime,
    recoveryEmail,
    recoveryPhone,
    orgUnitPath,
    suspended,
    isEnrolledIn2Sv,
    id,
  } = props.data

  // localhost endpoint
  const URL = 'http://localhost:5000/action/'

  const handleUnsuspension = async (e: React.FormEvent) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'React Hooks POST Request Example',
        }),
      }

      const response: Response = await fetch(
        `${URL}unsuspend/${activeUser}`,
        requestOptions,
      )
      response.json()
      onDataRevalidate()

      Swal.fire({
        icon: 'success',
        text: 'Cookies have been reset successfully',
      }).then(({ isConfirmed, dismiss }) => {
        if (
          isConfirmed ||
          dismiss === Swal.DismissReason.backdrop ||
          dismiss === Swal.DismissReason.esc ||
          dismiss === Swal.DismissReason.close
        ) {
          onDataRevalidate()
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops... ',
        text: 'Something went wrong',
      })
    }
  }

  const handleRecoveryInfoRemoval = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'React Hooks POST Request Example',
        }),
      }

      const response: Response = await fetch(
        `${URL}clear-recovery-info/${activeUser}`,
        requestOptions,
      )

      response.json()
      // onDataRevalidate()

      Swal.fire({
        icon: 'success',
        text: 'Recovery information has been removed successfully',
      }).then(({ isConfirmed, dismiss }) => {
        if (
          isConfirmed ||
          dismiss === Swal.DismissReason.backdrop ||
          dismiss === Swal.DismissReason.esc ||
          dismiss === Swal.DismissReason.close
        ) {
          onDataRevalidate()
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops... ',
        text: 'Something went wrong',
      })
    }
  }

  const handleCookiesReset = async (e: React.FormEvent) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'React Hooks POST Request Example',
        }),
      }

      const response: Response = await fetch(
        `${URL}signin-cookies/${activeUser}`,
        requestOptions,
      )
      response.json()
      // onDataRevalidate()

      Swal.fire({
        icon: 'success',
        text: 'Cookies have been reset successfully',
      }).then(({ isConfirmed, dismiss }) => {
        if (
          isConfirmed ||
          dismiss === Swal.DismissReason.backdrop ||
          dismiss === Swal.DismissReason.esc ||
          dismiss === Swal.DismissReason.close
        ) {
          onDataRevalidate()
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops... ',
        text: 'Something went wrong',
      })
    }
  }

  // split the string
  const [sortedDate, exactTime] = lastLoginTime.split('T')

  return (
    <>
      <Table striped bordered>
        <thead className='thead-dark'>
          <tr>
            <th colSpan={2}>Google account information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Primary Email</td>
            <td>{primaryEmail ? primaryEmail : 'NA'}</td>
          </tr>
          {/* <tr>
					<td>Aliases</td>
					<td>{myAliases}</td>
				</tr> */}
          <tr>
            <td>Recovery Email</td>
            <td>{recoveryEmail === '' ? 'None' : recoveryEmail}</td>
          </tr>
          <tr>
            <td>Recovery Phone</td>
            <td>{recoveryPhone === '' ? 'None' : recoveryPhone}</td>
          </tr>
          <tr>
            <td>Service Type</td>
            <td>{orgUnitPath}</td>
          </tr>
          <tr>
            <td>Last login (web)</td>
            <td>
              {lastLoginTime === '1970-01-01T00:00:00.000Z'
                ? 'Never signed in'
                : `${sortedDate} at ${exactTime.split('.')[0]} UTC`}
            </td>
          </tr>
          <tr>
            <td>Has 2SV?</td>
            <td>{isEnrolledIn2Sv ? 'Yes' : 'NO'}</td>
          </tr>
          <tr>
            <td>Is Suspended?</td>
            <td>{suspended ? 'YES' : 'NO'}</td>
          </tr>
          <tr>
            <td>Google ID</td>
            <td>{id}</td>
          </tr>
        </tbody>
      </Table>
      <div className='actions'>
        <div className='actions--header'>
          <h1>Actions</h1>
        </div>
        <div className='actions--disclaimer'>
          <p>
            ⚠ Be mindful that these actions will directly affect the customer's
            account. Please, use with caution.
          </p>
        </div>
        <div className='actions--buttons'>
          <Button
            variant='secondary'
            onClick={handleUnsuspension}
            disabled={!suspended}
          >
            unsuspend user
          </Button>
          <Button onClick={handleCookiesReset} variant='secondary'>
            reset sign-in cookies
          </Button>
          <Button
            // disabled={!(lastLoginTime === '1970-01-01T00:00:00.000Z')}
            onClick={handleRecoveryInfoRemoval}
            variant='secondary'
          >
            remove recovery info
          </Button>
        </div>
      </div>
    </>
  )
}

export default UserTable
