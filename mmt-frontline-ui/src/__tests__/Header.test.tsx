import React from 'react'
import '@testing-library/jest-dom/extend-expect'

import { fireEvent, render } from '@testing-library/react'

import Header from '../components/Header'

describe('tests for my Header component', () => {
  test('to have an input to submit the email', () => {
    const mockFn = jest.fn()
    const { getByPlaceholderText } = render(<Header setActiveUser={mockFn} />)

    const input = getByPlaceholderText('Enter email address...')
    expect(input).toBeInTheDocument()
  })

  test('The input value updates as we type in', () => {
    const mockFn = jest.fn()
    const { getByPlaceholderText } = render(<Header setActiveUser={mockFn} />)
    const input = getByPlaceholderText('Enter email address...')

    fireEvent.change(input, { target: { value: 'hec' } })
    expect((input as HTMLInputElement).value).toBe('hec')
  })

  test('The input is complete once is done typing', () => {
    const mockFn = jest.fn()
    const { getByPlaceholderText } = render(<Header setActiveUser={mockFn} />)
    const input = getByPlaceholderText('Enter email address...')

    fireEvent.change(input, { target: { value: 'hector.serrano@telus.net' } })
    expect((input as HTMLInputElement).value).toBe('hector.serrano@telus.net')
  })

  test('the button is disabled upon first render', () => {
    const mockFn = jest.fn()

    const { getByPlaceholderText } = render(<Header setActiveUser={mockFn} />)
    const input = getByPlaceholderText('Enter email address...')

    expect(input.nextElementSibling).toHaveAttribute('disabled')
  })
})
