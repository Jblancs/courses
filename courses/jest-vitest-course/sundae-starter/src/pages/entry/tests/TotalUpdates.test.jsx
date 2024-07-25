import { render, screen } from '../../../test-utils/testing-library-utils'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Options from '../Options'
import { OrderDetailsProvider } from '../../../contexts/OrderDetails'

test('update scoop subtotal when scoops change', async () => {
  const user = userEvent.setup()
  render(<Options optionType="scoops" />)

  // make sure total starts out at $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false })
  expect(scoopsSubtotal).toHaveTextContent('0.00')

  // update vailla scoops to 1 and check subtotal
  const vaillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  })

  await user.clear(vaillaInput) // good to clear element before changing
  await user.type(vaillaInput, '1')
  expect(scoopsSubtotal).toHaveTextContent('2.00')

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', { name: 'Chocolate' })

  await user.clear(chocolateInput)
  await user.type(chocolateInput, '2')
  expect(scoopsSubtotal).toHaveTextContent('6.00')
})
