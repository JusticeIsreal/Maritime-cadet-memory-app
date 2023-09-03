import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import { Url } from "next/dist/shared/lib/router/router";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsHeart, BsHeartFill, BsPersonFill } from "react-icons/bs";
import { GiPerson, GiStopSign } from "react-icons/gi";
import { LuDownload, LuDownloadCloud } from "react-icons/lu";
import { MdLocationPin, MdOutlineClose } from "react-icons/md";
import { RiChatHistoryFill } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Moment from "react-moment";
import { db } from "../../Firebase";

interface DynamicPictureProps {
  grabDynamicDetails: any;
  setGrabDynamicDetails: (value: any) => void;
  fetchDetail: any[];
  setLoginTriger: (value: any) => void;
  postID: any;
}
function DynamicPictureModal({
  grabDynamicDetails,
  setGrabDynamicDetails,
  fetchDetail,
  setLoginTriger,
  postID,
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

  // GET NEXT AUTH USER SESSION DETAILS
  const { data: session } = useSession();

  // PICTURES LIKE STATE
  const [likes, setLikes] = useState<any[]>([]);
  const [hasLikes, setHasLikes] = useState<boolean>(false);

  // fetch likes from firebase
  useEffect(() => {
    onSnapshot(collection(db, "memories", postID, "likes"), (snapshot) => {
      return setLikes(snapshot.docs);
    });
  }, [db]);

  // to unlike logic
  useEffect(() => {
    setHasLikes(
      likes.findIndex(
        (like) => like.id === (session?.user as { uid: any })?.uid
      ) !== -1
    );
  }, [likes]);

  // LIKE AN IMAGE AND SAME TIME ADD IT TO FAVOURITES
  const addToFav = async (id: string) => {
    if (session) {
      if (hasLikes) {
        await deleteDoc(
          doc(
            db,
            "memories",
            postID,
            "likes",
            (session?.user as { uid: any })?.uid
          )
        );
        // return;
      } else {
        await setDoc(
          doc(
            db,
            "memories",
            postID,
            "likes",
            (session?.user as { uid: any })?.uid
          ),
          {
            username: (session.user as { username: any })?.username,
          }
        );
        return;
      }
    } else {
      setLoginTriger(true);
    }
  };
  const [readAll, setReadAll] = useState(true);
  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card forDynamic-picture">
          <span className="go-back-login " onClick={() => closeModal()}>
            <MdOutlineClose className="login-close-icon go-bac" />
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
                <div className="likenshare">
                  <span className="likenshareicon">
                    {hasLikes ? (
                      <BsHeartFill
                        className="like-red icon"
                        style={{ color: "red" }}
                        onClick={() => addToFav(grabDynamicDetails.id)}
                      />
                    ) : (
                      <BsHeart
                        onClick={() => addToFav(grabDynamicDetails.id)}
                        className="icon"
                      />
                    )}
                    <sub>{likes.length > 0 ? <>{likes.length}</> : null}</sub>
                  </span>
                </div>
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
              <div className="poster-details">
                <div className="poster-details-img">
                  <img src={fetchDetail[0]?.image} alt="" />
                </div>
                <div className="poster-name-con">
                  <p className="poster-name">{fetchDetail[0]?.name}</p>
                  <Moment fromNow className="time-sent">
                    {grabDynamicDetails?.timestamp?.toDate()}
                  </Moment>
                </div>
              </div>
              <div className="post-details">
                <MdLocationPin className="post-details-icon" />
                <span className="post-detail">
                  {grabDynamicDetails?.picturelocation}
                </span>
              </div>
              <div className="post-details">
                <BsPersonFill className="post-details-icon" />
                <span className="post-detail">
                  {grabDynamicDetails?.namesonpicture}
                </span>
              </div>
              <div className="post-details">
                <RiChatHistoryFill className="post-details-icon" />
                <span className="post-detail">
                  {grabDynamicDetails?.message.length < 2 ? (
                    <span className="testing">
                      {grabDynamicDetails?.message[0].name}
                    </span>
                  ) : (
                    <span className="testing">
                      {readAll ? (
                        <>
                          {grabDynamicDetails?.message[0].name.substring(
                            0,
                            100
                          )}{" "}
                          <span
                            onClick={() => setReadAll(!readAll)}
                            style={{
                              color: "black",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            more. . .
                          </span>
                        </>
                      ) : (
                        <>
                          {grabDynamicDetails?.message?.map(
                            (item: any, index: number) => (
                              <span key={index}>
                                {item.name} <br />
                                <br />
                              </span>
                            )
                          )}
                          <span
                            onClick={() => setReadAll(!readAll)}
                            style={{
                              color: "black",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            Read less
                          </span>
                        </>
                      )}
                    </span>
                  )}
                </span>
              </div>

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
