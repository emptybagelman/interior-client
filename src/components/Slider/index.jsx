import React,{ useState } from 'react'
import "./style.scss"

const Slider = ({ changeState, left=false }) => {


  return (
    <div className='slider-wrapper' onClick={changeState}>
        <div className={left ? "left-to-right inner" : "right-to-left inner"} style={left ? {"left":"0"} : {"right":"0"}}></div>
    </div>
  )
}

export default Slider