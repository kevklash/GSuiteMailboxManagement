import React from 'react'
import { LogsObj } from '../types/APItypes'

interface LogTableProps {
  // idx: number
  item: LogsObj
}

const LogTable: React.FC<LogTableProps> = props => {
  // TODO extracts item later
  const { item } = props

  return (
    <>
      <tr>
        <td>{item.actor.email}</td>
        <td>
          {item.id.applicationName === 'admin'
            ? item.events[0].parameters[0].value
            : item.actor.email}
        </td>
        <td>{item.events[0].name}</td>
        <td>{item.id.time.split('T')[0]}</td>
        <td>{item.ipAddress}</td>
        <td>
          {item.id.applicationName === 'user_accounts' ? 'True' : 'False'}
        </td>
      </tr>
    </>
  )
}

export default LogTable
