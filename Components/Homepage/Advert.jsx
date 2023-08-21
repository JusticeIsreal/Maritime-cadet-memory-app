import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Blockquote } from "@mantine/core";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../Firebase";
import Link from "next/link";
const defaultAdImg =
  "https://res.cloudinary.com/isreal/image/upload/v1682609506/E-Commerce%20Project/advert_ehvsy1.png";

function Advert() {
  const autoplay = useRef(Autoplay({ delay: 4000 }));

  // FETCHING ADVERT SORTED FROM FIREBABSE
  const [advertDetails, setAdvertDetails] = useState([]);
  const [advertImg, setAdvertImg] = useState([]);
  const [advertLink, setAdvertLink] = useState("");
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "advert"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setAdvertDetails(snapshot.docs);
      }
    );
  }, [db]);
  useEffect(() => {
    setAdvertImg(advertDetails.map((item) => item.data().image));
  }, [db, advertDetails]);

  useEffect(() => {
    setAdvertLink(advertDetails.map((item) => item.data().adlink));
  }, [db, advertDetails]);

  return (
    <div className="ad-con">
      {advertImg.length > 0 ? (
        <Carousel
          // withIndicators
          // height={200}
          slideSize="50%"
          slideGap="md"
          dragFree
          loop
          align="start"
          breakpoints={[
            // { maxWidth: "lg", slideSize: "50%" },
            { maxWidth: "md", slideSize: "50%" },
            { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
          ]}
          plugins={[autoplay.current]}
        >
          <Carousel.Slide>
            <div className="ad-img">
              <Link href="/products">
                <img src={advertImg[0][0]} alt="add" />
              </Link>
              <Blockquote cite="– Kola Ibrahim">
                <p>
                  this is the best place to get all you fashion out fit, they
                  delivered in 2 days , no story
                </p>
              </Blockquote>
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div className="ad-img">
              <Link href="/products">
                <img src={advertImg[0][1]} alt="add" />
              </Link>
              <Blockquote cite="– Kola Ibrahim">
                <p>
                  this is the best place to get all you fashion out fit, they
                  delivered in 2 days , no story
                </p>
              </Blockquote>
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div className="ad-img">
              <Link href="/products">
                <img src={advertImg[0][2]} alt="add" />
              </Link>
              <Blockquote cite="– Kola Ibrahim">
                <p>
                  this is the best place to get all you fashion out fit, they
                  delivered in 2 days , no story
                </p>
              </Blockquote>
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div className="ad-img">
              <Link href="/products">
                <img src={advertImg[0][3]} alt="add" />
              </Link>
              <Blockquote cite="– Kola Ibrahim">
                <p>
                  this is the best place to get all you fashion out fit, they
                  delivered in 2 days , no story
                </p>
              </Blockquote>
            </div>
          </Carousel.Slide>
        </Carousel>
      ) : null}
    </div>
  );
}

export default Advert;
