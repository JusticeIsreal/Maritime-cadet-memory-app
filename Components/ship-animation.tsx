import React from "react";

function ShipAnimation() {
  return (
    <>
     
      <div className="overlay"></div>
      <div className="sun"></div>
      <div className="shiny"></div>
      <div className="ship">
        <div></div>
        <div></div>
        <div></div>
        <ol>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ol>
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <ul className="sea">
        <li className="wave"></li>
        <li className="wave"></li>
        <li className="wave"></li>
        <li className="wave"></li>
        <li className="wave"></li>
        <li className="wave"></li>
        <li className="lastwave"></li>
      </ul>
    </>
  );
}

export default ShipAnimation;
