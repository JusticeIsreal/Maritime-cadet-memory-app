import Image from "next/image";
import React, { useState } from "react";

const aboutMemoire =
  "At its core, our initiative was born from a simple desire: to immortalize the memories that shaped our journey as Maritime Academy of Nigeria Cadets. What started as sharing images on Google Drive evolved when Kingsley John and Justice Agbonma united their skills to build Mémoire 18. This platform captures the essence of our cadet experiences, transcending departments, and preserving them for the future. Our commitment drives us forward, ensuring cherished memories endure as a tribute to the Academy's legacy and the cadets who forged it.";
function Slider() {
  const [readAll, setReadAll] = useState(true);
  return (
    <div className="slider-con">
      <h3>About Memoire18</h3>
      <p className="about-mobile">
        {readAll ? (
          <>
            {aboutMemoire.substring(0, 110)}{" "}
            <span onClick={() => setReadAll(!readAll)}>more. . .</span>
          </>
        ) : (
          <>
            {aboutMemoire}
            <span onClick={() => setReadAll(!readAll)}>close...</span>
          </>
        )}
      </p>
      <p className="about-desktop">
        {readAll ? (
          <>
            {aboutMemoire.substring(0, 285)}{" "}
            <span onClick={() => setReadAll(!readAll)}>more. . .</span>
          </>
        ) : (
          <>
            {aboutMemoire}
            <span onClick={() => setReadAll(!readAll)}>close</span>
          </>
        )}
      </p>
      {/* <div className="slider-con-bg"></div> */}
    </div>
  );
}

export default Slider;
