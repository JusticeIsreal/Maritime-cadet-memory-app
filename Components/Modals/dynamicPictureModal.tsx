import { signIn } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { GiStopSign } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface DynamicPictureProps {
  grabDynamicDetails: any;
  setGrabDynamicDetails: (value: any) => void;
}
function DynamicPictureModal({
  grabDynamicDetails,
  setGrabDynamicDetails,
}: DynamicPictureProps) {
  // GO BACK
  const closeModal = () => {
    setGrabDynamicDetails("");
  };
  // change image display
  const [disimg, setDisimg] = useState<number>(0);
  const changeIMG = (e: any, index: number) => {
    setDisimg(index);
  };
  const originalURL = grabDynamicDetails?.image[disimg];
  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card forDynamic-picture">
          <span className="go-back-login" onClick={() => closeModal()}>
            <MdOutlineClose className="login-close-icon" />
          </span>
          <div className=" Dynamic-picture-details">
            <div className="image-side-main-con">
              <div className="main-image-con">
                <LazyLoadImage
                  src={originalURL}
                  alt="img"
                  loading="lazy"
                  className="cadet-img"
                />
              </div>

              {grabDynamicDetails?.image.length > 1 && (
                <div className="small-display">
                  <div className="small-display-img">
                    {grabDynamicDetails?.image.map(
                      (img: any, index: number) => (
                        <div className="display-img" key={index}>
                          <Image
                            className="smalling"
                            src={img && img}
                            alt="img"
                            width={50}
                            height={50}
                            onClick={(e) => changeIMG(e, index)}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div>poster info</div>
              <div>location and year</div>
              <div>people</div>
              <div>story</div>
              <div>comment inbox</div>
              <div>comment list</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicPictureModal;
