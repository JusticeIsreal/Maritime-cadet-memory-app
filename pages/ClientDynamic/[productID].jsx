import Loader from "../../Components/Loader";
import Topbar from "../../Components/Topbar";
import Moment from "react-moment";
import {
  useEffect,
  useState,
  useRef,
  useContext,
  SetStateAction,
  Key,
} from "react";
import {
  UnstyledButton,
  Group as mantinegroup,
  Avatar,
  Text,
} from "@mantine/core";

import { useRouter } from "next/router";
import Link from "next/link";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../Firebase";
import Image from "next/image";
import { Blockquote } from "@mantine/core";
import { Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// ICONS
import { LuDownload } from "react-icons/lu";
import { TiArrowBack } from "react-icons/ti";
import { useForm } from "react-hook-form";
import { addToCart, getSessionUser } from "../../Services/functions";
import Modal from "../../Components/Modal";
import { CartQuantityContext } from "../_app";
import { signIn, useSession } from "next-auth/react";
import { MdArrowBackIos } from "react-icons/md";
import { BsHeart, BsHeartFill } from "react-icons/bs";

export async function getStaticPaths() {
  const colRef = collection(db, "memories");
  const snapshot = await getDocs(colRef);
  const paths = snapshot.docs.map((doc) => ({
    params: { productID: doc.id },
  }));

  return { paths, fallback: "blocking" };
}

export const getStaticProps = async ({ params }) => {
  const { productID } = params;
  const productDoc = doc(db, "memories", productID);
  const productSnapshot = await getDoc(productDoc);
  const productData = productSnapshot.data();

  // Convert timestamp to string
  // productData.timestamp = productData.timestamp.toString();

  return {
    props: {
      product: null,
    },
  };
};

function Details() {
  // GET NEXT AUTH USER SESSION DETAILS
  const { data: session } = useSession();
  const router = useRouter();
  const { productID } = router.query;
  const pic = useRef();
  const setCartQty = useContext(CartQuantityContext).setCartQty;

  // GO BACK

  function goBack() {
    router.back();
  }

  // fetch product by id
  const [product, setProduct] = useState();
  async function fetchItemFromFirestore() {
    const itemRef = doc(db, "memories", productID);
    const itemDoc = await getDoc(itemRef);
    if (itemDoc.exists()) {
      // Extract the data from the document and return it
      const itemData = itemDoc.data();
      setProduct(itemData);
      setDisimg(0);
    } else {
      // Document does not exist
      return null;
    }
  }

  useEffect(() => {
    fetchItemFromFirestore();
  }, [productID]);

  // simillar product
  const [similarProducts, setSimilarProducts] = useState([]);
  // useEffect(() => {
  //   return onSnapshot(
  //     query(
  //       collection(db, "memories"),
  //       where("productcategory", "==", `${product?.productcategory}`)
  //     ),
  //     (snapshot) => {
  //       setSimilarProducts(
  //         snapshot.docs.filter(
  //           (item) =>
  //             item.data().productdescription !==
  //             `${product?.productdescription}`
  //         )
  //       );
  //     }
  //   );
  // }, [db, product?.productcategory, product?.productname]);

  // useform config
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // submit review
  const onSubmit = async (data, e) => {
    e.preventDefault();

    // post coment func
    await addDoc(collection(db, "memories", productID, "review"), {
      ...data,
      username: session?.user?.name,
      useremail: session?.user?.email,
      timestamp: serverTimestamp(),
    });

    reset();
  };
  // fetch comment rom firebase
  const [review, setReview] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "memories", productID, "review"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setReview(snapshot.docs)
      ),
    [db, productID]
  );

  // ADD TO CART
  const [dynamictriger, setDynamicTriger] = useState(true);

  const [loginTriger, setLoginTriger] = useState(false);

  const addToCar = async () => {
    setDynamicTriger(!dynamictriger);
    const productDoc = doc(db, "products", productID);
    const productSnapshot = await getDoc(productDoc);
    const productData = productSnapshot.data();
    setDynamicTriger(!dynamictriger);

    const triger = await getSessionUser();

    if (!triger) {
      return setLoginTriger(true);
    }

    const productExist = triger.userCart.find(
      (item) => item.productID === productID
    );

    if (
      (productExist && !productExist.productID) ||
      productExist === undefined
    ) {
      const cartResponse = await addToCart(productData, productID);
      if (cartResponse === "SUCCESS") {
        const userData = await getSessionUser();
        setCartQty(userData?.user.cart.length);
        notifications.show({
          title: "Notification",
          message: "Successful , Item added to cart",
        });
      }
    } else
      notifications.show({
        title: "Notification",
        message: "Failed, Item already in cart",
        color: "red",
      });

    setDynamicTriger(!dynamictriger);
  };

  // PICTURES LIKE STATE

  const [likes, setLikes] = useState([]);
  const [hasLikes, setHasLikes] = useState(false);
  // fetch likes from firebase
  useEffect(() => {
    onSnapshot(collection(db, "memories", productID, "likes"), (snapshot) => {
      return setLikes(snapshot.docs);
    });
  }, [db, productID]);
  // to unlike logic
  useEffect(() => {
    setHasLikes(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  // LIKE AN IMAGE AND SAME TIME ADD IT TO FAVOURITES
  const addToFav = async () => {
    const productDoc = doc(db, "memories", productID);
    const productSnapshot = await getDoc(productDoc);
    const productData = productSnapshot.data();
    if (session) {
      if (hasLikes) {
        await deleteDoc(
          doc(db, "memories", productID, "likes", session?.user?.uid)
        );
        // return;
      } else {
        await setDoc(
          doc(db, "memories", productID, "likes", session?.user?.uid),
          {
            username: session.user?.username,
          }
        );
        return;
      }
    } else {
      setLoginTriger(true);
    }
  };
  // GET  DETAILS OF POSTER
  const [users, setUsers] = useState([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "registered_Users"), orderBy("time", "desc")),
      (snapshot) => {
        setUsers(snapshot.docs);
      }
    );
  }, [likes]);

  const posterImage = users.filter(
    (user) => user.data().userId === product?.posterId
  );

  const posterdetails = posterImage.map((img) => img.data());
  // console.log(product?.image[disimg]);
  const [disimg, setDisimg] = useState(0);
  const changeIMG = (e, index) => {
    setDisimg(index);
  };
  function replaceCloudinaryValue(url, replacement) {
    const startIndex = url.indexOf("/upload/") + 8; // Find the index after "/upload/"
    const endIndex = url.lastIndexOf("/"); // Find the last index before the filename
    if (startIndex !== -1 && endIndex !== -1) {
      const middlePart = url.substring(startIndex, endIndex); // Get the middle part to replace
      const newURL = url.replace(middlePart, replacement); // Replace the middle part

      return router.push(newURL);
    }
    return router.push(url); // Return the original URL if the parts are not found
  }

  const originalURL = product?.image[disimg];
  // const newURL = replaceCloudinaryValue(originalURL, "fl_attachment:JJ2022");
  // console.log(newURL);
  return (
    <>
      {loginTriger && <Modal setLoginTriger={setLoginTriger} />}

      <Group position="center"></Group>
      <Topbar
        setSearch={function (value) {
          router.push("/");
        }}
      />
      <div className="client-single-product">
        <div className="single-product">
          <div className="top-container">
            <div className="big-display-con">
              <button onClick={goBack} className="go-back">
                <MdArrowBackIos />
              </button>
              <div className="big-display-img">
                {product ? (
                  <Image
                    src={product && product.image[disimg]}
                    alt="img"
                    fill
                    sizes="100vw"
                    className="img"
                  />
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
          {product?.image.length > 1 && (
            <div className="small-display-img-co">
              <div className="small-display-img-container">
                {product?.image.map((img, index) => (
                  <div className="small-display-img" key={index}>
                    <Image
                      className="smallimg"
                      src={img && img}
                      alt="img"
                      width={50}
                      height={50}
                      ref={pic}
                      onClick={(e) => changeIMG(e, index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}{" "}
          <div className="likenshar">
            <span className="likenshareico">
              {hasLikes ? (
                <BsHeartFill
                  className="like-red"
                  style={{ color: "red" }}
                  onClick={() => addToFav()}
                />
              ) : (
                <BsHeart onClick={() => addToFav()} />
              )}
              <sub>
                {likes.length > 0 ? (
                  <>
                    {likes.length}
                    {likes.length > 1 ? " " + "likes" : " " + "like"}
                  </>
                ) : null}
              </sub>
            </span>
            <span className="comment">
              <a href="#comment" style={{ color: "gray" }}>
                {review.length} {review.length > 1 ? "comments" : "comment"}
              </a>
            </span>
            <span
              className="comment"
              onClick={() =>
                replaceCloudinaryValue(originalURL, "fl_attachment:JJ2022")
              }
            >
              <LuDownload /> Download
            </span>
          </div>
        </div>
        <div className="single-product-details">
          <UnstyledButton className="profile-head">
            <Group>
              <Avatar size={40} color="blue">
                <img src={posterdetails[0]?.image} alt="img" />
              </Avatar>
              <div>
                <Text>{posterdetails[0]?.name}</Text>
                <Text size="xs" color="dimmed">
                  <Moment fromNow>{product?.timestamp?.toDate()}</Moment>
                </Text>
              </div>
            </Group>
          </UnstyledButton>
          <div className="product-review">
            {/* <h1>COMMENTS</h1> */}

            <div>
              <p className="testing">
                <b>tags: </b>
                {product?.namesonpicture}
              </p>
            </div>
            <div>
              {product?.message.length < 2 ? (
                <p className="testing">{product?.message[0].name}</p>
              ) : (
                <p className="testing">
                  {product?.message?.map((item, index) => (
                    <span key={index}>
                      {item.name} <br />
                      <br />
                    </span>
                  ))}
                </p>
              )}
            </div>

            {session ? null : (
              <span
                style={{ padding: "0 5px", fontSize: "14px", color: "red" }}
              >
                Login to write a comment{" "}
                <span style={{ color: "blue" }} onClick={signIn}>
                  Click here
                </span>
              </span>
            )}
            <div className="review-con">
              {/* <p className="review-count">
                {review.length} {review.length > 1 ? "comments" : "comment"}
              </p> */}
              <div className="reviews" id="comment">
                {review.map((comment) => (
                  <div className="quote" key={comment?.id}>
                    <Blockquote cite="" className="chatit">
                      <UnstyledButton>
                        <Group>
                          <Avatar size={40} color="blue">
                            {comment.data().username.split(" ").length > 1
                              ? comment.data().username.split(" ")[0][0] +
                                " " +
                                comment.data().username.split(" ")[1][0]
                              : comment.data().username.split(" ")[0][0]}
                          </Avatar>
                          <div>
                            <Text>{comment.data().username}</Text>
                            <Text size="xs" color="dimmed">
                              <Moment fromNow className="time-posted">
                                {comment.data().timestamp?.toDate()}
                              </Moment>
                            </Text>
                          </div>
                        </Group>
                      </UnstyledButton>
                      <p className="quote-text">{comment.data().yourreview}</p>
                    </Blockquote>
                  </div>
                ))}
              </div>
              {/* COMMENT FORM */}
              {session && (
                <div className="review-form-con">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                      type="text"
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
                        Kindly Enter Your Review
                      </span>
                    )}
                    <input type="submit" className="submit-btn" value="SEND" />
                  </form>
                </div>
              )}
            </div>
          </div>
          {/* similar products */}
        </div>
      </div>
    </>
  );
}

export default Details;
