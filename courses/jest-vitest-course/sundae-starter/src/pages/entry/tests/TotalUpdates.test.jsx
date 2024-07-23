import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Options from '../Options'

test('update scoop subtotal when scoops change', async () => {
  const user = userEvent.setup()
  render(<Options optionType="scoops" />)

  // make sure total starts out at $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false })
  expect(scoopsSubtotal).toHaveTextContent('0.00')

  // update vailla scoops to 1 and check subtotal
  const vaillaInput = await screen.findByRole('spinbutton', {
    name: 'Vailla',
  })

  await user.clear() // good to clear element before changing
  await user.type(vaillaInput, '1')
  expect(scoopsSubtotal).toHaveTextContent('2.00')

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', { exact: false })

  await user.clear()
  await user.type(chocolateInput, '2')
  expect(scoopsSubtotal).toHaveTextContent('4.00')
})
