import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Moment from "react-moment";
import { db } from "../../Firebase";
import { useForm } from "react-hook-form";
import {
  Avatar,
  Blockquote,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { BiSolidCalendar } from "react-icons/bi";

interface DynamicPictureProps {
  grabDynamicDetails: any;
  setGrabDynamicDetails: (value: any) => void;
  fetchDetail: any[];
  setLoginTriger: (value: any) => void;
  setPostID: (value: any) => void;
  setSearch: (value: string) => void;
  postID: any;
  pictures: any[];
}
function DynamicPictureModal({
  grabDynamicDetails,
  setGrabDynamicDetails,
  fetchDetail,
  setLoginTriger,
  postID,
  pictures,
  setPostID,
  setSearch,
}: DynamicPictureProps) {
  // GO BACK
  const closeModal = () => {
    setGrabDynamicDetails("");
    setSearch("");
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

  // useform config
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // submit review
  const onSubmit = async (data: any, e: any) => {
    if (!session) {
      return setLoginTriger(true);
    }

    e.preventDefault();

    // post coment func
    await addDoc(collection(db, "memories", postID, "review"), {
      ...data,
      username: session?.user?.name,
      useremail: session?.user?.email,
      userimage: session?.user?.image,
      timestamp: serverTimestamp(),
    });
    // Navigate to a different URL
    window.location.href = "#commentLocation";

    reset();
  };

  const [review, setReview] = useState<any[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "memories", postID, "review"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setReview(snapshot.docs)
      ),
    [db, postID]
  );

  // Counter to show next slide
  // selecting each post
  const postsByIdArr = pictures.map((item) => item.id);
  let currentDetailIndex = postsByIdArr.indexOf(postID);
  const countPlus = async () => {
    currentDetailIndex += 1;
    if (currentDetailIndex > postsByIdArr.length) {
      currentDetailIndex = postsByIdArr.length - 1;
    }
    const itemRef = doc(db, "memories", postsByIdArr[currentDetailIndex]);
    const itemDoc = await getDoc(itemRef);
    setPostID(postsByIdArr[currentDetailIndex]);
    if (itemDoc.exists()) {
      const itemData = itemDoc.data();
      setGrabDynamicDetails(itemData);
    } else {
      return null;
    }
  };
  const countMinus = async () => {
    currentDetailIndex -= 1;
    if (currentDetailIndex < 0) {
      currentDetailIndex = 0;
    }
    const itemRef = doc(db, "memories", postsByIdArr[currentDetailIndex]);
    const itemDoc = await getDoc(itemRef);
    setPostID(postsByIdArr[currentDetailIndex]);
    if (itemDoc.exists()) {
      const itemData = itemDoc.data();
      setGrabDynamicDetails(itemData);
    } else {
      return null;
    }
  };
  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card forDynamic-picture">
          <div className="Forward-backward-con">
            <div className="fb-btn-con">
              <span onClick={countMinus}>
                <FaChevronLeft className="fb-btn-icon" />
              </span>
              <span onClick={countPlus}>
                <FaChevronRight className="fb-btn-icon" />
              </span>
            </div>
          </div>
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
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <div className="poster-details" style={{ cursor: "pointer" }}>
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
                </Menu.Target>
                <Menu.Dropdown style={{ background: "#d8f2ff" }}>
                  <Menu.Label>Cdt: {fetchDetail[0]?.name}</Menu.Label>
                  <Menu.Label>{fetchDetail[0]?.email}</Menu.Label>
                </Menu.Dropdown>
              </Menu>
              <div className="post-details">
                <MdLocationPin className="post-details-icon" />
                <span className="post-detail">
                  {grabDynamicDetails?.picturelocation}
                </span>
              </div>
              <div className="post-details">
                <BsPersonFill className="post-details-icon" />
                <span className="post-detail">
                  {grabDynamicDetails?.namesonpicture} (
                  {grabDynamicDetails?.department})
                </span>
              </div>
              <div className="post-details">
                <BiSolidCalendar className="post-details-icon" />
                <span className="post-detail">
                  {grabDynamicDetails?.pictureyear}
                </span>
              </div>
              <div className="post-details">
                <RiChatHistoryFill className="post-details-icon" />
                <p className="post-detail">
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
                              <p key={index}>
                                {item.name} <br />
                                <br />
                              </p>
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
                </p>
              </div>

              <div className="review-con" id="commentLocation">
                {/* COMMENT FORM */}
                <div className="review-form-con">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                      placeholder="Write a comment"
                      {...register("yourreview", { required: true })}
                    />
                    {errors.yourreview && (
                      <span
                        className="errror-msg"
                        style={{
                          fontSize: "12px",
                          fontStyle: "italic",
                          color: "red",
                        }}
                      >
                        Kindly write a comment
                      </span>
                    )}
                    <input
                      type="submit"
                      value="Comment"
                      className="submit-btn"
                    />
                  </form>
                </div>
                {/* comments */}
                <div className="reviews" id="comment">
                  {review?.map((comment) => (
                    <div className="quote" key={comment?.id}>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <Group style={{ cursor: "pointer" }}>
                            <Avatar color="blue" className="commentimage">
                              <img src={comment.data().userimage} alt="img" />
                            </Avatar>
                            <div className="commenter-name">
                              <Text>{comment.data().username}</Text>
                              <Text size="xs" color="dimmed">
                                <Moment fromNow className="time-posted">
                                  {comment.data().timestamp?.toDate()}
                                </Moment>
                              </Text>
                            </div>
                          </Group>
                        </Menu.Target>
                        <Menu.Dropdown style={{ background: "#d8f2ff" }}>
                          <Menu.Label>
                            Cdt: {comment.data().username}
                          </Menu.Label>
                          <Menu.Label>{comment.data().useremail}</Menu.Label>
                        </Menu.Dropdown>
                      </Menu>
                      <p className="quote-text">{comment.data().yourreview}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicPictureModal;
