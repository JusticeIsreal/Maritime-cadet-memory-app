import Image from "next/image";
import React, { useState } from "react";

import { Fade, Slide } from "react-slideshow-image";

const aboutMemoire =
  "At its core, our initiative was born from a simple desire: to immortalize the memories that shaped our journey as Maritime Academy of Nigeria Cadets. What started as sharing images on Google Drive evolved when Kingsley John and Justice Agbonma united their skills to build Mémoire 18. This platform captures the essence of our cadet experiences, transcending departments, and preserving them for the future. Our commitment drives us forward, ensuring cherished memories endure as a tribute to the Academy's legacy and the cadets who forged it.";

const ImageSample = [
  {
    id: 1,
    img: "https://res.cloudinary.com/dd61rrbxs/image/upload/v1692802824/tyeaf8318lredevnee4l.jpg",
  },
  {
    id: 2,
    img: "https://res.cloudinary.com/dd61rrbxs/image/upload/v1693200033/Rectangle_2_mvicyt.png",
  },
  {
    id: 3,
    img: "https://res.cloudinary.com/dd61rrbxs/image/upload/v1693200175/g116_l60psv.jpg",
  },
  {
    id: 4,
    img: "https://res.cloudinary.com/dd61rrbxs/image/upload/v1693200033/Rectangle_2_mvicyt.png",
  },
];

function Slider() {
  const [readAll, setReadAll] = useState(true);
  return (
    <div className="slider-con">
      <div className="slider-main">
        <h3>About Memoire18</h3>
        <p className="about-mobile">
          {readAll ? (
            <>
              {aboutMemoire.substring(0, 110)}{" "}
              <span onClick={() => setReadAll(!readAll)}>more...</span>
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
              <span onClick={() => setReadAll(!readAll)}>more...</span>
            </>
          ) : (
            <>
              {aboutMemoire}
              <span onClick={() => setReadAll(!readAll)}>close</span>
            </>
          )}
        </p>
      </div>

      <div className="slider-Image-bg">
        <div className="slider-img-con">
          <Fade arrows={false}>
            {ImageSample?.map((item, index) => (
              <div className="carousel-items-con" key={item.id}>
                <Image
                  src={item?.img}
                  alt="img"
                  className="img"
                  fill
                  sizes="100vw"
                  style={{
                    right: "0",
                  }}
                />
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </div>
  );
}

export default Slider;
