import axios from 'axios'
import { useEffect, useState } from 'react'
import ScoopOption from './ScoopOption'
import Row from 'react-bootstrap/Row'
import ToppingOption from './ToppingOption'

export default function Options({ optionType }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    axios
      .get(`http://localhost:3030/${optionType}`)
      // optionType is scoops or topping (large app would create enum)
      .then((res) => setItems(res.data))
      .catch((error) => {
        // TODO: handle error response
      })
  }, [optionType])

  // TODO: replace 'null' with ToppingOption when available
  const ItemComponent = optionType === 'scoops' ? ScoopOption : ToppingOption
  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
    />
  ))

  return (
    <Row>
        {optionItems}
    </Row>
  )
}
