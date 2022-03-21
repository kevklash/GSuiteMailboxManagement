import React from 'react'
import Swal from 'sweetalert2'
import { Table, Button } from 'react-bootstrap'
import { DataObj } from '../types/APItypes'
import Tooltip from 'react-simple-tooltip'
import { FaInfoCircle } from 'react-icons/fa';
import { FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

interface UserTableProps {
  activeUser: string
  onDataRevalidate: () => void
  data: DataObj
  // idx: string
}
var mmt_user = 'mmt_user@telus.com'

const UserTable: React.FC<UserTableProps> = props => {
  const { activeUser, onDataRevalidate } = props
  const { t, i18n } = useTranslation()

  const {
    primaryEmail,
    lastLoginTime,
    recoveryEmail,
    recoveryPhone,
    orgUnitPath,
    suspended,
    suspensionReason,
    isEnrolledIn2Sv,
    id,
  } = props.data

// Importing configurations
var configuration_data = require('../client_config.json')

// Endpoint URL
const URL: string = configuration_data[0].value
const URL2: string = configuration_data[1].value

  const handleUnsuspension = () => {
    Swal.fire({
      title: t("unsuspend_confirm"),
      text: t("unsuspend_info"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t("yes_button"),
      cancelButtonText: t("no_button"),
    }).then(result => {
      if (result.isConfirmed) {
        // make the API call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'React Hooks POST Request Example',
            agent: mmt_user,
            email: primaryEmail,
            google_id: id
          }),
        }

        fetch(`${URL2}unsuspend/`, requestOptions)
          .then((res: Response) => res.json())
          .then(() => {
            Swal.fire({
              icon: 'success',
              text: t("unsuspend_success"),
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
          })
          .catch(() => {
            console.log('the api call went wrong')
          })
      } else {
        Swal.fire({
          title: t("cancel_confirm"),
          text: t("cancel_info"),
          icon: 'info'
        })
      }
    })
  }

  const handleRecoveryInfoRemoval = () => {
    Swal.fire({
      title: t("recovery_confirm"),
      text: t("recovery_info"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t("yes_button"),
      cancelButtonText: t("no_button"),
    }).then(result => {
      if (result.isConfirmed) {
        // make the API call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'React Hooks POST Request Example',
            agent: mmt_user,
            email: primaryEmail,
            google_id: id
          }),
        }

        fetch(`${URL2}clear-recovery-info`, requestOptions)
          .then((res: Response) => res.json())
          .then(() => {
            Swal.fire({
              icon: 'success',
              text: t("recovery_success"),
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
          })
          .catch(() => {
            console.log('the api call went wrong')
          })
      } else {
        Swal.fire({
          title: t("cancel_confirm"),
          text: t("cancel_info"),
          icon: 'info'
        })
      }
    })
  }

  const handleCookiesReset = () => {
    Swal.fire({
      title: t("cookies_confirm"),
      text: t("cookies_info"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t("yes_button"),
      cancelButtonText: t("no_button"),
    }).then(result => {
      if (result.isConfirmed) {
        // make the API call
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'React Hooks POST Request Example',
            agent: mmt_user,
            email: primaryEmail,
            google_id: id
          }),
        }

        fetch(`${URL2}signin-cookies/`, requestOptions)
          .then((res: Response) => res.json())
          .then(() => {
            Swal.fire({
              icon: 'success',
              text: t("cookies_success"),
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
          })
          .catch(() => {
            // Swal.fire({
            //   icon: 'info',
            //   text: "You've chosen not to proceed",
            // })
            console.log('the api call went wrong')
          })
      } else {
        Swal.fire({
          title: t("cancel_confirm"),
          text: t("cancel_info"),
          icon: 'info'
        })
      }
    })
  }

  //Get date from lastLoginTime and convert to Date object 
  const utcDate = new Date(lastLoginTime)
  //conver from UTC to MT
  const convertedDate = utcDate.toLocaleString('en-US', {timeZone: 'America/Edmonton'})
  //Split the string
  const mountaintTime = convertedDate.split(',')

  // Define suspension message for tooltip
  let content = ''
  if(suspended){
    content = t("unsuspend_on")
  }
  else{
    content = t("unsuspend_off")
  }

  // Define 'remove recovery info' message for tooltip 
  let content_r = ''
  if((recoveryEmail === '') && (recoveryPhone === '')){
    content_r = t("recovery_off")
  }
  else{
    content_r = t("recovery_confirm")
  }

  // Define potential billing suspension disclaimer
  let content_suspension = ''
  if(suspensionReason === 'ADMIN'){
    content_suspension = t("warning_3")
  }
  else{
    content_suspension = t("warning_2")
  }

  // Define recovery email and phone empty value ext
  let recoveryEmail_text_na = ""
  let recoveryPhone_text_na = ""
  if(!recoveryEmail){
    recoveryEmail_text_na = t("rec_email_none")
  }
  
  if(!recoveryPhone){
    recoveryPhone_text_na = t("rec_phone_none")
  }


  return (
    <>
      <Table striped bordered>
        <thead className='thead-dark'>
          <tr>
            <th colSpan={2}>{t("header_1")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("header_primary_email")}</td>
            <td>{primaryEmail ? primaryEmail : 'NA'}</td>
          </tr>
          {/* <tr>
					<td>Aliases</td>
					<td>{myAliases}</td>
				</tr> */}
          <tr>
            <td>{t("header_recovery_email")}</td>
            <td>{recoveryEmail === '' ? recoveryEmail_text_na : recoveryEmail}</td>
          </tr>
          <tr>
            <td>{t("header_recovery_phone")}</td>
            <td>{recoveryPhone === '' ? recoveryPhone_text_na : recoveryPhone}</td>
          </tr>
          <tr>
            <td>{t("h_service_type")}</td>
            <td>{orgUnitPath}</td>
          </tr>
          <tr>
            <td>{t("h_last_login")}</td>
            <td>
              {lastLoginTime === '1970-01-01T00:00:00.000Z'
                ? t("login_time_none")
                : `${mountaintTime[0] + " " + t("login_time") + mountaintTime[1] + " MT"}`}
            </td>
          </tr>
          <tr>
            <td>{t("h_2stepv")} <Tooltip content={t("two_step_tip")}>
              <a href='http://ffh.onesource.tsl.telus.com/content/?pgid=133717&tx=2950&srcRef=41&query=two%20step%20verification#2stepverification' target='_blank'><FaInfoCircle/></a></Tooltip></td>
            <td>{isEnrolledIn2Sv ? t("two_step") : t("two_step_no")}</td>
          </tr>
          <tr>
            <td>{t("header_suspended")} <Tooltip content={t("suspended_tip")}>
              <a href='http://ffh.onesource.tsl.telus.com/content/?pgid=133717&tx=2950&srcRef=41&query=two%20step%20verification#Customers%20Google%20account%20disabled.' target='_blank'><FaInfoCircle/></a></Tooltip></td>
            <td>{suspended ? t("suspended") : t("not_suspended")}</td>
          </tr>
          <tr>
            <td>{t("google_id")}</td>
            <td>{id}</td>
          </tr>
        </tbody>
      </Table>
      <div className='actions'>
        <div className='actions--header'>
          <h1>{t("header_2")}</h1>
        </div>
        <div className='actions--disclaimer'>
        <p>
            <FaExclamationCircle /> {t("warning_1")}
          </p>
          <p>
            <FaExclamationCircle /> {content_suspension}
          </p>
        </div>
        <div className='actions--buttons'>
        <Tooltip content={content}>
            <Button
              variant='secondary'
              onClick={handleUnsuspension}
              disabled={!suspended}
            >
              {t("unsuspend_button")}
            </Button>
          </Tooltip>
          <Button onClick={handleCookiesReset} variant='secondary'>
            {t("cookies_button")}
          </Button>
          <Tooltip content={content_r}>
          <Button
            // disabled={!(lastLoginTime === '1970-01-01T00:00:00.000Z')}
            onClick={handleRecoveryInfoRemoval}
            variant='secondary'
            disabled={(recoveryEmail === '') && (recoveryPhone === '')}
          >
            {t("recovery_button")}
          </Button>
          </Tooltip>
        </div>
      </div>
    </>
  )
}

export default UserTable
