import { useState } from 'react'
import './App.css'
import { kebabCaseToTitleCase } from './helpers'

function App() {
  const [buttonColor, setButtonColor] = useState('medium-violet-red')
  const [disableButton, setDisableButton] = useState(false)
  const nextColor = buttonColor === 'medium-violet-red' ? 'midnight-blue' : 'medium-violet-red'

  return (
    <div>
      <button
        className={disableButton ? "gray" : buttonColor}
        onClick={() => setButtonColor(nextColor)}
        disabled={disableButton}
      >
        Change to {kebabCaseToTitleCase(nextColor)}
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
