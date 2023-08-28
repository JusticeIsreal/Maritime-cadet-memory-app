import Image from "next/image";
import React, { useEffect } from "react";

const generateStars = () => {
  const galaxy = document.querySelector(".galaxy") as HTMLElement;
  let iterator = 0;
  console.log(galaxy);
  if (galaxy) {
    while (iterator <= 50) {
      const xposition = Math.random();
      const yposition = Math.random();
      const star_type = Math.floor(Math.random() * 3) + 1;
      const position = {
        x: galaxy.offsetWidth * xposition,
        y: galaxy.offsetHeight * yposition,
      };

      const star = document.createElement("div");
      star.className = `star star-type${star_type}`;
      galaxy.appendChild(star);
      star.style.top = `${position.y}px`;
      star.style.left = `${position.x}px`;

      iterator++;
    }
  }
};

const Banner = () => {
  useEffect(() => {
    generateStars();
  }, []);

  return (
    <div className="banner-main-con">
      <div className="banner-img-con">
        <img src="/Ellipse 3.png" alt="" className="icon1" />
        <img src="/Ellipse 3.png" alt="" className="icon3" />
        <img src="/Star 3.png" alt="" className="icon2" />
        <img src="/Star 1.png" alt="" className="icon5" />
        <img src="/Star 3.png" alt="" className="icon4" />
        <img
          className="banner-text-img"
          src="/Collection of Cherished Moments.png"
          alt=""
        />
        <div className="creator">
          <p>Created by</p>
          <h3>Marine Engineering Class of '20 - The 64</h3>
        </div>
      </div>

      <div className="galaxy">
        <div></div>
      </div>
    </div>
  );
};

export default Banner;
