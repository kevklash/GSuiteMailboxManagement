import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { Table, Container, Row, Col, Spinner } from 'react-bootstrap'
import { useHistory, Redirect } from 'react-router-dom'
import { useTranslation } from "react-i18next"

// Importing Types
import { DataObj, LogsObj, UserLogsEndpointResponse } from './types/APItypes'

// Components importing
import Header from './components/Header'
import { Navigation } from './components/Navigation'
import MyTable from './components/Table'
import LogTable from './components/LogTable'
import MyPagination from './components/Pagination'
import Access from './components/Access'
import Suspend from './components/Suspend'
import ErrorPage from './components/ErrorPage'
import './App.css'
import { access } from 'fs'

// Importing configurations
var configuration_data = require('./client_config.json')

// Endpoint URL
const URL: string = configuration_data[0].value
const URL2: string = configuration_data[1].value
const accessWorkflowURL: String = configuration_data[2].value
var mmt_user = 'mmt_user@telus.com'

function Tool() {
  // Router history
  let history = useHistory()
  // Translation elements
  const { t, ready } = useTranslation()

  const [currentUserLogs, setCurrentUserLogs] = useState<number>(1)
  const [userLogsPerPage] = useState<number>(5)
  const [loading, setIsLoading] = useState<boolean>(false)
  const [shouldRevalidate, setShouldRevalidate] = useState<boolean>(false)
  const [activeUser, setActiveUser] = useState<{
    email: string
    data: Array<DataObj>
    logs: Array<LogsObj>
  }>({ email: '', data: [], logs: [] })
  // Error state
  const [varController, setVarController] = useState<String>("")

  const indexOfLastUserLogs: number = currentUserLogs * userLogsPerPage
  const indexOfFirstPost: number = indexOfLastUserLogs - userLogsPerPage
  const currentLogsObj: Array<LogsObj> = activeUser.logs.slice(
    indexOfFirstPost,
    indexOfLastUserLogs,
  )

  /* React.useEffect(() => {
    // Access workflow
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent: mmt_user,
      }),
    }
    // set loading
    setIsLoading(true)
    fetch(`${accessWorkflowURL}`, requestOptions)
      .then(res => res.json())
      .then(json => {
        // The user didn't exist, it gets successfully created and returns a "reason", 
        // An access request is automatically submitted in the backend
        // set loading false
        setIsLoading(false)
        if(json.reason){
          setVarController("requested")
        }
        // The user does exist
        else{
          // Check if it has access
          if(json.user_status === "inactive"){
            setVarController("inactive")
          }
          else if(json.user_status === "suspended"){
            setVarController("suspended")
          }
        }
      })
      .catch(err => {
        Swal.fire({
          title: t("alert_error_title"),
          text: t("alert_error_text"),
          icon: "error",
          confirmButtonText: t("confirm_button"),
        }).then(() => {
          //history.push({
            //pathname: '/request',
            //state: varController
          //})
          setVarController("__server_error__")
        })
      })
    // End access workflow
  }, []) */

  React.useEffect(() => {
    const fetchUserData = async () => {
      // set loading
      setIsLoading(true)
      
      // Hardcoded user status
      setVarController("active")

      // Initial request headers
      const initialRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'React Hooks POST Request Example',
          agent: mmt_user,
          email: activeUser.email,
          google_id: 'not_yet_fetched'
        }),
      }

      try {
        // HTTP reqs (number of them: 3)
        const data = await fetch(`${URL}`, initialRequestOptions).then(
          (resp: Response) => {
            if (resp.ok) {
              return resp.json()
            } else {
              throw resp
            }
          },
        )

        // Request headers
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'React Hooks POST Request Example',
            agent: mmt_user,
            email: data['primaryEmail'],
            google_id: data['id']
          }),
        }

        // console.log(data)

        // self pwd changes
        const [res]: Array<UserLogsEndpointResponse> = await fetch(
          `${URL2}user-password-info`, requestOptions
        ).then((resp: Response) => resp.json())

        // pwd changes by microservice
        const res2: LogsObj[] = await fetch(
          `${URL2}password-info`, requestOptions
        ).then((res: Response) => res.json())

        //! Checking if they have info so the app doesn't break
        const filteredArr: LogsObj[] = res2.length > 1 ? [...res2] : []
        const userLogs: LogsObj[] = res.items ?? []

        //! binding both so we can setData with the properties spread
        const logsUnion = [...userLogs, ...filteredArr]

        // setters
        setActiveUser(state => ({
          ...state,
          data: [data],
          logs: logsUnion,
        }))
        setShouldRevalidate(false)
        setIsLoading(false)
      } catch (error) {
        if (error.status === 404) {
          setActiveUser(prevState => ({
            ...prevState,
            data: [],
            logs: [],
          }))
          Swal.fire({
            icon: 'warning',
            title: t("not_found_confirm"),
            text: t("not_found_info"),
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: t("error_confirm"),
            text: t("error_info"),
          })
        }
        setIsLoading(false)
      }
    }

    if (typeof activeUser.email === 'string' && activeUser.email !== '') {
      fetchUserData()
    }
  }, [activeUser.email, shouldRevalidate])

  const setActiveUserHandler = (inputEmail: string) =>
    setActiveUser(state => ({
      ...state,
      email: inputEmail,
    }))

  const paginate = (num: number) => {
    setCurrentUserLogs(num)
  }

  // Render based on access level
  if(varController){
    if(varController !== '' && varController === 'requested'){
      return <Access />
    }
    else if(varController !== '' && varController === 'suspended'){
      return <Suspend />
    }
    else if(varController !== '' && varController === 'inactive'){
      return <Access />
    }
    else if(varController !== '' && varController === '__server_error__'){
      return <ErrorPage />
    }
  }
  // End redirect

  
  if (ready) {
    return (
      <>
        <Navigation />
        <Container fluid className='mt-4'>
          <Row>
            <Col lg={8}>
              <Header setActiveUser={setActiveUserHandler} />
            </Col>
          </Row>
          <Row className='mt-4'>
            {!loading && activeUser.data.length > 0 && (
              <Col lg={8} xs={12}>
                {activeUser.data.map(item => (
                  <MyTable
                    data={item}
                    key={item.id}
                    activeUser={activeUser.email}
                    onDataRevalidate={() => setShouldRevalidate(true)}
                  />
                ))}
              </Col>
            )}
          </Row>
          <Row>
            {loading ? (
              <div className='mx-auto'>
                <Spinner animation='border' role='status' />
              </div>
            ) : (
              <Col lg={12}>
                {activeUser.logs && activeUser.logs.length > 0 ? (
                  <>
                    <Table
                      className='tableLogs'
                      hover
                      responsive
                      striped
                      bordered
                      variant='dark'
                    >
                      <thead>
                        <tr>
                          <th>{t("header_3")}</th>
                          <th>{t("header_4")}</th>
                          <th>{t("header_5")}</th>
                          <th>{t("header_6")}</th>
                          <th>{t("header_7")}</th>
                          <th>{t("header_8")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentLogsObj.map((item, idx) => (
                          <LogTable item={item} key={idx} />
                        ))}
                      </tbody>
                    </Table>
                    <MyPagination
                      userLogsPerPage={userLogsPerPage}
                      totalUserLogs={activeUser.logs.length}
                      paginate={paginate}
                    />
                  </>
                ) : null}
              </Col>
            )}
          </Row>
        </Container>
      </>
    )
  }


  return (
    <div className='mx-auto'>
              <Spinner animation='border' role='status' />
    </div>
  )
}

export default Tool
