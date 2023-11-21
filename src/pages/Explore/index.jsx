import React, { useEffect } from 'react'
 import { ExploreItems } from '../../components/'


const Explore = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  },[])

  return (
    <div className='explore' >
    <ExploreItems />  
  </div>
  )
}

export default Explore
