import { signIn } from "next-auth/react";
import { Url } from "next/dist/shared/lib/router/router";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { GiStopSign } from "react-icons/gi";
import { LuDownload, LuDownloadCloud } from "react-icons/lu";
import { MdOutlineClose } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Moment from "react-moment";

interface DynamicPictureProps {
  grabDynamicDetails: any;
  setGrabDynamicDetails: (value: any) => void;
  fetchDetail: any[];
}
function DynamicPictureModal({
  grabDynamicDetails,
  setGrabDynamicDetails,
  fetchDetail,
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

  // download image
  const router = useRouter();
  function replaceCloudinaryValue(url: string, replacement: string) {
    const startIndex = url.indexOf("/upload/") + 8; // Find the index after "/upload/"
    const endIndex = url.lastIndexOf("/"); // Find the last index before the filename
    if (startIndex !== -1 && endIndex !== -1) {
      const middlePart = url.substring(startIndex, endIndex); // Get the middle part to replace
      const newURL = url.replace(middlePart, replacement); // Replace the middle part
      return router.push(newURL);
    }
    return router.push(url); // Return the original URL if the parts are not found
  }
  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card forDynamic-picture">
          <span className="go-back-login" onClick={() => closeModal()}>
            <MdOutlineClose className="login-close-icon" />
          </span>

          <div className=" Dynamic-picture-details">
            <div className="image-side-main-con">
              <span
                className="download-image"
                onClick={() =>
                  replaceCloudinaryValue(originalURL, "fl_attachment:JJ2022")
                }
              >
                <LuDownload className="login-close-icon" />
              </span>
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
                        <div
                          className={`${
                            disimg === index
                              ? "chosen-image display-img"
                              : "display-img"
                          }`}
                          key={index}
                        >
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
            <div className="details-comment-main-con">
              <div>
                <div>
                  <img src={fetchDetail[0]?.image} alt="" />
                </div>
                <p>{fetchDetail[0]?.name}</p>
                <Moment fromNow>
                  {grabDynamicDetails?.timestamp?.toDate()}
                </Moment>
              </div>
              <div>location and year</div>
              <div>people</div>
              <div>story</div>
              <div>comment inbox</div>
              <div>comment list</div>

              <div>poster info</div>
              <div>location and year</div>
              <div>people</div>
              <div>story</div>
              <div>comment inbox</div>
              <div>comment list</div>
              <div>poster info</div>
              <div>location and year</div>
              <div>people</div>
              <div>story</div>
              <div>comment inbox</div>
              <div>comment list</div>
              <div>poster info</div>
              <div>location and year</div>
              <div>poster info</div>
              <div>location and year</div>
              <div>people</div>
              <div>story</div>
              <div>comment inbox</div>
              <div>comment list</div>
              <div>poster info</div>
              <div>location and year</div>
              <div>poster info</div>
              <div>location and year</div>
              <div>people</div>
              <div>story</div>
              <div>comment inbox</div>
              <div>comment list</div>
              <div>poster info</div>
              <div>location and year</div>
              <div>poster info</div>
              <div>location and year</div>
              <div>people</div>
              <div>story</div>
              <div>comment inbox</div>
              <div>comment list</div>
              <div>poster info</div>
              <div>location and year</div>
              <div>people</div>
              <div>story</div>
              <div>comment inbox</div>
              <div>comment list</div>
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
