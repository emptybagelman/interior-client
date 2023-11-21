import React,{ useState, useRef } from 'react'
import "./style.scss"
import { useAuth } from '../../contexts'

const QuestionHelp = ({active, title, content, summaryContent="", image="", orientation="right"}) => {

    const [dropdown,setDropdown] = useState(true)

    const { width } = useAuth()

    const questionRef = useRef()

    function toggleDrop(){
        setDropdown(!dropdown)
        if(dropdown){
            questionRef.current.style.display = "block"
        }else{
            questionRef.current.style.display = "none"
        }
    }

  return (
    <div id={width > 850 ? "questions" : "mobile-q"} data-testid="questions" style={!dropdown && width <= 850 ? {"left":"0","top":"0"} : {}} >
        <p id='qmark' onClick={toggleDrop} data-testid="qmark" style={width <= 850 ? dropdown ? {} : {"display":"none"} : {}}>?</p>
            <div className={width <= 850 ? "mobile-qbox" : "qbox"} data-testid="qBox" ref={questionRef}  style={Object.assign(orientation && width > 850 === "right" ? {"left":"200%"} : {"right":"150%"},
            !active ? {"display":"none"} : {})
            }>
                 <div id="top-bits">
                    <h3>{title}</h3>
                    {width <= 850 ? <p onClick={toggleDrop}>X</p> : ""}
                 </div>
                <p>{content}</p>{
                    summaryContent !== "" ?
                <details>
                    <summary id='summarytext'>{summaryContent}</summary>
                    <img id="example-panoramic" src={image} alt="" />
                </details>
                : ""
                }
            </div>
    </div>
    
  )
}

export default QuestionHelp
