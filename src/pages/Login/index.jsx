import React,{ useState, useEffect, useRef } from 'react'
import { LoginCard, LightSwitch, SignupCard } from "../../components"
import "./style.scss"
import sound from "../../assets/audio/lightswitch.wav"
import { useAuth } from '../../contexts'

const Login = () => {

  const [toggleSwitch, setToggleSwitch] = useState(true)
  const { width } = useAuth()

  const focusStyle = {
    "background": "#EDE4D9",
    // "background": "linear-gradient(0deg, rgba(20,8,14,1) 0%, rgba(250,248,242,1) 100%)",
    "backgroundColor":"#EDE4D9"

  }

  function playAudio() {
    new Audio(sound).play()
  }

  function changeState() {
    setToggleSwitch(!toggleSwitch)
  }

  function keyboardSwitch(e){
    if (e.key == " "){
      playAudio()
      setToggleSwitch(!toggleSwitch)
    }
  }

  return (
    <div id='login-page' onKeyDown={keyboardSwitch} tabIndex={0} aria-label='Press space to switch between login and register'>

{/*  cardHeight={cardHeight} */}
        <LoginCard changeState={changeState} toggleSwitch={toggleSwitch} focusStyle={focusStyle} />

        { width > 850 ? <LightSwitch changeState={changeState} toggleSwitch={toggleSwitch}/> : "" }

{/*  cardHeight={cardHeight} */}
        <SignupCard changeState={changeState} toggleSwitch={toggleSwitch} focusStyle={focusStyle} setToggleSwitch={setToggleSwitch}/>
    </div>
  )
}

export default Login
