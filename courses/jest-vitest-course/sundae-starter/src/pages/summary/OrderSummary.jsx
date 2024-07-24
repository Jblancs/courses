import React from 'react'
import SummaryForm from './SummaryForm'
import { useOrderDeatils } from '../../contexts/OrderDetails'
import { formatCurrency } from '../../utilities'

export default function OrderSummary() {
  const { totals, optionCounts } = useOrderDeatils()

  const scoopArray = Object.entries(optionCounts.scoops) //[['chocolate', 2], ['vanilla', 1]]
  const scoopList = scoopArray.map(([key, value]) => (
    <li key={key}>
      {value} {key}
    </li>
  ))

  const toppingArray = Object.keys(optionCounts.toppings) //['M&Ms', 'Gummi bears']
  const toppingList = toppingArray.map((key) => <li key={key}>{key}</li>)

  return (
    <div>
      <h1>OrderSummary</h1>
      <h2>Scoops: {formatCurrency(totals.scoops)}</h2>
      <ul>{scoopList}</ul>
      <h2>Toppings: {formatCurrency(totals.toppings)}</h2>
      <ul>{toppingList}</ul>
      <SummaryForm />
    </div>
  )
}
