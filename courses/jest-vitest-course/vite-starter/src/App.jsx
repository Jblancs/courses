import { useState } from 'react'
import './App.css'

function App() {
  const [buttonColor, setButtonColor] = useState('red')
  const [disableButton, setDisableButton] = useState(false)
  const nextColor = buttonColor === 'red' ? 'blue' : 'red'

  return (
    <div>
      <button
        className={disableButton ? "gray" : buttonColor}
        onClick={() => setButtonColor(nextColor)}
        disabled={disableButton}
      >
        Change to {nextColor}
      </button>
      <br />
      <input
        type="checkbox"
        id="disable-button-checkbox"
        defaultChecked={disableButton}
        onClick={() => setDisableButton(!disableButton)}
      />
      <label htmlFor="disable-button-checkbox">Disable Button</label>
    </div>
  )
}

export default App
