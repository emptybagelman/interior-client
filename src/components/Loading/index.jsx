import React,{ useEffect, useState } from 'react'
import "./style.scss"

const Loading = () => {

    const [elipsis, setElipsis ] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setElipsis(prev => 3 - (prev + 1) % 3 )
        },500)

        return () => clearInterval(interval)
    },[])

  return (
    <div className='loading-wrapper'>
        <h1>LOADING</h1>
        <p>Please wait {".".repeat(elipsis)}</p>
    </div>
  )
}

export default Loading