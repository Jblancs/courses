import axios from 'axios'
import { useEffect, useState } from 'react'
import ScoopOption from './ScoopOption'
import Row from 'react-bootstrap/Row'
import ToppingOption from './ToppingOption'
import AlertBanner from '../common/AlertBanner'
import { pricePerItem } from '../../constants'
import { formatCurrency } from '../../utilities'
import { useOrderDetails } from '../../contexts/OrderDetails'

export default function Options({ optionType }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState(false)
  const {totals} = useOrderDetails()

  useEffect(() => {
    const controller = new AbortController()
    axios
      .get(`http://localhost:3030/${optionType}`, {signal: controller.signal})
      // optionType is scoops or topping (large app would create enum)
      .then((res) => setItems(res.data))
      .catch((error) => {
        // TODO: handle error response
        if (error.name !== 'CanceledError') {
          setError(true)
        }
      })

      //abort axios call on component unmount
      return () => {controller.abort()}
  }, [optionType])

  if (error) {
    return <AlertBanner />
  }

  // TODO: replace 'null' with ToppingOption when available
  const ItemComponent = optionType === 'scoops' ? ScoopOption : ToppingOption
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase()

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
    />
  ))

  return (
    <>
      <h2>{title}</h2>
      <p>{formatCurrency(pricePerItem[optionType])} each</p>
      <p>{title} total: {formatCurrency(totals[optionType])}</p>
      <Row>{optionItems}</Row>
    </>
  )
}
