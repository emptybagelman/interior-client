import React,{ useState, useEffect, useMemo } from 'react'
import sound from "../../assets/audio/lightswitch.wav"
import "./style.scss"
import { useAuth } from '../../contexts'

const LightSwitch = ({ changeState, toggleSwitch }) => {

    const [ usePull, setUsePull ] = useState(false)
    const [style,setStyle] = useState({"transform":"translateY(0px)"})
    const { width } = useAuth()

    const shadedStyle = {
        "background": "linear-gradient(0deg, rgba(250,248,242,1) 0%, rgba(73,71,91,1) 95%)",
        "width": "80px",
        "height": "138px",
        "left": "8px",
        "top": "-38px",
        "transform": "rotateX(85deg)"
    }

    const mainStyle = {
        "background": "linear-gradient(180deg, rgba(250,248,242,1) 0%, rgba(69,67,71,1) 97%)",
        "top": "12px",
        "left":"8px",
        "width": "80px",
        "height": "218px",
        "transform": "rotateX(-40deg)"
    }

    function playAudio() {
        new Audio(sound).play()
    }

    function mouseDownEvent(){
        setStyle({"transform":"translateY(50px)"})
    }

    function mouseUpEvent(){
        setStyle({"transform":"translateY(0px)"})
    }

    function handleCord(){
      if(width <= 1280){
        setUsePull(true)
      }else{
        setUsePull(false)
      }
    }

    useEffect(() => {
      handleCord()
    }, [width]);


  return (
    <>
        { usePull
        ?
        <div className="pull-container" onClick={() => {changeState();playAudio()}} onMouseDown={mouseDownEvent} onMouseUp={mouseUpEvent} style={style}>
            <div id="cord"></div>
            <div id="bob"></div>
            <h4>Click to Switch</h4>
        </div>
        :
        <div data-testid={"container"} className="switch-container">
        <h4 id='login-label'>Click To Switch</h4>
        <div className="switch" onClick={() => {changeState();playAudio()}}>
            <div id="toggle">
                <div id="mainbit" style={toggleSwitch ? mainStyle : {}}></div>
                <div id="shadedbit" style={toggleSwitch ? shadedStyle : {}}></div>
            </div>
        </div>
        <div id='register-label' className="spacebar-graphic">
            <p>Or Press Space</p>
            <div className="spacebar"></div>
        </div>
    </div> 
    }
    </>

  )
}

export default LightSwitch
