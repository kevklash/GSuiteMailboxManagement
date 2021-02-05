import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { Table, Container, Row, Col, Spinner } from 'react-bootstrap'

// Importing Types
import { DataObj, LogsObj, UserLogsEndpointResponse } from './types/APItypes'

// Components importing
import Header from './components/Header'
import { Navigation } from './components/Navigation'
import MyTable from './components/Table'
import LogTable from './components/LogTable'
import MyPagination from './components/Pagination'
import './App.css'

const URL: string = 'http://localhost:5000/action/info/'

function App() {
  const [currentUserLogs, setCurrentUserLogs] = useState<number>(1)
  const [userLogsPerPage] = useState<number>(5)
  const [loading, setIsLoading] = useState<boolean>(false)
  const [shouldRevalidate, setShouldRevalidate] = useState<boolean>(false)
  const [activeUser, setActiveUser] = useState<{
    email: string
    data: Array<DataObj>
    logs: Array<LogsObj>
  }>({ email: '', data: [], logs: [] })

  const indexOfLastUserLogs: number = currentUserLogs * userLogsPerPage
  const indexOfFirstPost: number = indexOfLastUserLogs - userLogsPerPage
  const currentLogsObj: Array<LogsObj> = activeUser.logs.slice(
    indexOfFirstPost,
    indexOfLastUserLogs,
  )

  React.useEffect(() => {
    const fetchUserData = async () => {
      // set loading
      setIsLoading(true)
      try {
        // HTTP reqs (number of them: 3)
        const data = await fetch(
          `${URL}${activeUser.email}`,
        ).then((resp: Response) => resp.json())

        // self pwd changes
        const [res]: Array<UserLogsEndpointResponse> = await fetch(
          `http://localhost:5000/action/user-password-info/${activeUser.email}`,
        ).then((resp: Response) => resp.json())

        // pwd changes by microservice
        const res2: LogsObj[] = await fetch(
          `http://localhost:5000/action/password-info/${activeUser.email}`,
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
        Swal.fire({
          icon: 'error',
          title: 'Oops... ',
          text: 'Something went wrong',
        })
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
          {!loading && (
            <Col lg={4} xs={12}>
              {activeUser.data.map(item => (
                <MyTable
                  data={item}
                  idx={item.id}
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
                        <th>Changed by</th>
                        <th>Affected email</th>
                        <th>Event</th>
                        <th>Date</th>
                        <th>IP</th>
                        <th>Self?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLogsObj.map((item, idx) => (
                        <LogTable item={item} idx={idx} />
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

export default App
