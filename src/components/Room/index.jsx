import React, {useState}  from 'react';
import EnvironmentMap from '../EnvironmentMaps';
import Heart from "react-animated-heart";

import { AiOutlineComment } from 'react-icons/ai'

const Room = () => {
  const [isClick, setClick] = useState(false);
  const maps = [
 ['../../src/assets/environmentMaps/0/px.png',
    '../../src/assets/environmentMaps/0/nx.png',
    '../../src/assets/environmentMaps/0/py.png',
    '../../src/assets/environmentMaps/0/ny.png',
    '../../src/assets/environmentMaps/0/pz.png',
    '../../src/assets/environmentMaps/0/nz.png'],
    // ['../../src/assets/environmentMaps/2/px.png',
    // '../../src/assets/environmentMaps/2/nx.png',
    // '../../src/assets/environmentMaps/2/py.png',
    // '../../src/assets/environmentMaps/2/ny.png',
    // '../../src/assets/environmentMaps/2/pz.png',
    // '../../src/assets/environmentMaps/2/nz.png'],
]

  return (
    <div className="environment-map-grid">
      {maps.map((mapUrls, index) => (
        <EnvironmentMap key={index} mapUrls={mapUrls} />
      ))}
      <div className='like-bar'>
        <p className='favourites'>Add to favourites</p>
         <Heart isClick={isClick} onClick={() => setClick(!isClick)} />

         <p></p>
         <button className='comments-button'>Comments <AiOutlineComment /></button>
      </div>
    </div>
  );
};

export default Room;








