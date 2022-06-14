import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  // useRef has two main uses to create so calld references of two kind:
  // 1.to get a pointer at a real DOM node, we create varialble const mapRef = useRef();
  // and then where we want that variable to pint on a Html element we set up 
  // spacial prop ref and assign that varialbe to it, now the connection is established, 
  // and the acutal pointer that we need is held by the .current property on our variable
  //  2.we could also create variables 
  // which survive rerender cycles of our components  and dont loose they value 
  const mapRef = useRef();
  
  const { center, zoom } = props;

  useEffect(() => {
    // inndex.html will crrate new google to window, and on it we have .maps and
    // .Map, this is a contructor function which will now be available on the global 
    // window object thanks to our javascript importe in index.html;
    // this now need a pointer at an element where the map should be rendered- 
    // we could use document.getElementbyId and assign an id to our div below , like we do in here:
    // in index.js: ReactDOM.render(<App />, document.getElementById('root'));
    // but we use useRef - I wonder if we could use ref in index.js
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });
  
    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);  

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
