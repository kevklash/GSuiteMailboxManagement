import React from 'react'
import { render } from '@testing-library/react'
import Table from '../components/Table'
import { makeServer } from '../server'
import '@testing-library/jest-dom/extend-expect'

let server

const sampleUser = {
  primaryEmail: 'hector.serrano@telus.com',
  lastLoginTime: '2021-01-16T21:46:53.000Z',
  recoveryEmail: 'fonto.serrano@gmail.com',
  recoveryPhone: '77124644',
  orgUnitPath: ['ou', 'users', 'consumer'],
  suspended: 'false',
  isEnrolledIn2Sv: 'true',
  id: '309234293849234893284',
}

beforeEach(() => {
  server = makeServer()
})

afterEach(() => {
  server.shutdown()
})

test('there should be a row that shows Email address of user', async () => {
  const mockFn = jest.fn()

  const { getByText } = render(
    <Table
      data={sampleUser}
      onDataRevalidate={mockFn}
      activeUser='hector.serrano@telus.com'
    />,
  )

  const element = getByText(sampleUser.primaryEmail)
  expect(element).toBeInTheDocument()
})

test('when the primaryEmail is not supplied', async () => {
  const mockFn = jest.fn()

  const { getByText } = render(
    <Table
      data={sampleUser}
      onDataRevalidate={mockFn}
      activeUser='hector.serrano@telus.com'
    />,
  )

  const element = getByText('Primary Email')
  expect(element.textContent).toBe('Primary Email')
})
