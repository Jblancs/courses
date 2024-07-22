import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import SummaryForm from '../SummaryForm'
import userEvent from '@testing-library/user-event'

test('SummaryForm checkbox initial conditions', () => {
  // render component
  render(<SummaryForm />)
  const checkboxElement = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  })
  const buttonElement = screen.getByRole('button', {
    name: /confirm/i,
  })

  expect(checkboxElement).not.toBeChecked()
  expect(buttonElement).toBeDisabled()
})

test('SummaryForm checkbox click flow', async () => {
  const user = userEvent.setup()

  render(<SummaryForm />)
  const checkboxElement = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  })
  const buttonElement = screen.getByRole('button', {
    name: /confirm/i,
  })

  // click on checkbox
  await user.click(checkboxElement)
  expect(checkboxElement).toBeChecked()
  expect(buttonElement).toBeEnabled()

  await user.click(checkboxElement)
  expect(checkboxElement).not.toBeChecked()
  expect(buttonElement).toBeDisabled()
})

test('popover responds to hover', async () => {
  const user = userEvent.setup()

  render(<SummaryForm />)

  // popover starts out hidden
  const nullPopover = screen.queryByText(/no ice cream will actually be delivered/i)
  expect(nullPopover).not.toBeInTheDocument()

  // popover appears on mouseover of checkbox label
  const termsAndCond = screen.getByText(/terms and conditions/i)
  await userEvent.hover(termsAndCond)
  const popover = screen.getByText(/no ice cream will actually be delivered/i)
  expect(popover).toBeInTheDocument()

  // popover disappears when we mouse out
  await userEvent.unhover(termsAndCond)
  expect(popover).not.toBeInTheDocument()

})
