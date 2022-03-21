import React from 'react'
import { Nav } from 'react-bootstrap'

interface PaginationProps {
  totalUserLogs: number
  userLogsPerPage: number
  paginate: (num: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  totalUserLogs,
  userLogsPerPage,
  paginate,
}) => {
  const pageNumbers: number[] = []

  for (
    let i: number = 1;
    i <= Math.ceil(totalUserLogs / userLogsPerPage);
    i++
  ) {
    pageNumbers.push(i)
  }

  return (
    <Nav>
      {pageNumbers.map(num => (
        <Nav.Item key={num} className='page-item'>
          <Nav.Link
            className='page-link link-style'
            onClick={() => paginate(num)}
          >
            {num}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  )
}

export default Pagination
