import { render, screen } from '../../../test-utils/testing-library-utils'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import Options from '../Options'
import OrderEntry from '../OrderEntry'

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

test('update topping subtotal when toppings change', async () => {
  const user = userEvent.setup()
  render(<Options optionType='toppings' />)

  const toppingsSubtotal = screen.getByText('Toppings total: $', {exact: false})
  expect(toppingsSubtotal).toHaveTextContent('0.00')

  // hot fudge interaction
  const hotFudgeInput = await screen.findByRole('checkbox', {
    name: 'Hot fudge'
  })
  await user.click(hotFudgeInput)
  expect(toppingsSubtotal).toHaveTextContent('1.50')

  // M&M interaction
  const mmInput = await screen.findByRole('checkbox', {
    name: 'M&Ms'
  })
  await user.click(mmInput)
  expect(toppingsSubtotal).toHaveTextContent('3.00')

  await user.click(hotFudgeInput)
  await user.click(mmInput)
  expect(toppingsSubtotal).toHaveTextContent('0.00')
})

describe('grand total', () => {
  test('grand total starts at $0.00', async () => {
    const {unmount} = render(<OrderEntry />)

    const grandTotal = await screen.findByRole('heading', {name: /Grand total: \$/i})
    expect(grandTotal).toHaveTextContent('0.00')

    unmount()
  })

  test('grand total updates properly if scoop is added first', async () => {
    const user = userEvent.setup()
    render(<OrderEntry />)

    const grandTotal = await screen.findByRole('heading', {name: /Grand total: \$/i})

    const scoopInput = await screen.findByRole('spinbutton', {name: 'Chocolate'})
    await user.clear(scoopInput)
    await user.type(scoopInput, '1')
    expect(grandTotal).toHaveTextContent('2.00')

    const toppingInput = await screen.findByRole('checkbox', {name: 'Hot fudge'})
    await user.click(toppingInput)
    expect(grandTotal).toHaveTextContent('3.50')

  })

  test('grand total updates properly if topping is added first', async () => {
    const user = userEvent.setup()
    render(<OrderEntry />)

    const grandTotal = await screen.findByRole('heading', {name: /Grand total: \$/i})

    const toppingInput = await screen.findByRole('checkbox', {name: 'Hot fudge'})
    await user.click(toppingInput)
    expect(grandTotal).toHaveTextContent('1.50')

    const scoopInput = await screen.findByRole('spinbutton', {name: 'Chocolate'})
    await user.clear(scoopInput)
    await user.type(scoopInput, '1')
    expect(grandTotal).toHaveTextContent('3.50')

  })

  test('grand total updates properly if item is removed', async () => {
    const user = userEvent.setup()
    render(<OrderEntry />)

    const grandTotal = await screen.findByRole('heading', {name: /Grand total: \$/i})

    const toppingInput = await screen.findByRole('checkbox', {name: 'Hot fudge'})
    await user.click(toppingInput)
    expect(grandTotal).toHaveTextContent('1.50')

    const scoopInput = await screen.findByRole('spinbutton', {name: 'Chocolate'})
    await user.clear(scoopInput)
    await user.type(scoopInput, '2')
    expect(grandTotal).toHaveTextContent('5.50')

    await user.click(toppingInput)
    expect(grandTotal).toHaveTextContent('4.00')

    await user.clear(scoopInput)
    await user.type(scoopInput, '1')
    expect(grandTotal).toHaveTextContent('2.00')
  })

})
