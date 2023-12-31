import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import AddNewMemory from "../AddNewMemory";
import ShipAnimation from "../ship-animation";
import { BsFillStarFill } from "react-icons/bs";

const generateStars = () => {
  // CREATING AN NIMATION OF SLY LIGHT
  const galaxy = document.querySelector(".galaxy") as HTMLElement;
  let iterator = 0;

  if (galaxy) {
    while (iterator <= 80) {
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

  // Text Slide
  return (
    <div className="banner-main-con">
      <div className="banner-con">
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
          <Link href="/memories">
            <div className="creator">
              <button>See Memories</button>
            </div>
          </Link>
        </div>
      </div>

      <div className="galaxy">
        <div></div>
      </div>
      <div className="cadet-img-con">
        <ShipAnimation />
      </div>

      <div style={{ color: "#001d3d" }} className="text-sli">
        <div className="text-sl">
          <span>
            Developed by{" "}
            <a href="https://www.justiceagbonma.com">Justice Agbonma</a>
          </span>
          <BsFillStarFill className="img" />
          <span>
            Designed by <a href="http://kingsleyjohn.com"> Kingsley John</a>
          </span>
          <BsFillStarFill className="img" />
          <span>
            Developed by{" "}
            <a href="https://www.justiceagbonma.com">Justice Agbonma</a>
          </span>
          <BsFillStarFill className="img" />
          <span>
            Designed by{" "}
            <a href="https://www.kingsleyjohn.com"> Kingsley John</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
