import { logRoles } from '@testing-library/react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { expect } from 'vitest'

test('button click flow', () => {
  // render app
  const { container } = render(<App />)

  // use logRoles to help figure out what roles to use
  // logRoles(container)

  // adding name plays role of assertion and throws error if button is not found with text including blue
  // find the button
  const buttonElement = screen.getByRole('button', { name: /blue/i })

  // check initial color
  expect(buttonElement).toHaveClass('red')

  // click the button
  fireEvent.click(buttonElement)

  // check button text
  expect(buttonElement).toHaveTextContent(/red/i)
  // check button color
  expect(buttonElement).toHaveClass('blue')

  // better to test classes instead of actual style (testing styles is slow)
  expect(buttonElement).toHaveStyle({ 'background-color': 'rgb(0, 0, 255)' })
})

test('checkbox flow', () => {
  render(<App />)

  // find elements
  const buttonElement = screen.getByRole('button', { name: /blue/i })
  const checkboxElement = screen.getByRole('checkbox', {
    name: /disable button/i,
  })

  // check initial conditions
  expect(buttonElement).toBeEnabled()
  expect(checkboxElement).not.toBeChecked()

  // click checkbox
  fireEvent.click(checkboxElement)
  // check button element if disabled
  expect(buttonElement).toBeDisabled()
  expect(buttonElement).toHaveClass('gray')

  // uncheck checkbox
  fireEvent.click(checkboxElement)
  // check if enabled
  expect(buttonElement).toBeEnabled()
  expect(buttonElement).toHaveClass('red')
})

test('checkbox flow after click', () => {
  render(<App />)

  // find elements
  const buttonElement = screen.getByRole('button', { name: /blue/i })
  const checkboxElement = screen.getByRole('checkbox', {
    name: /disable button/i,
  })

  // click the button
  fireEvent.click(buttonElement)

  // click checkbox
  fireEvent.click(checkboxElement)
  // check button element if disabled
  expect(buttonElement).toBeDisabled()
  expect(buttonElement).toHaveClass('gray')

  // uncheck checkbox
  fireEvent.click(checkboxElement)
  // check if enabled
  expect(buttonElement).toBeEnabled()
  expect(buttonElement).toHaveClass('blue')
})

test('button has correct text after click', () => {})
