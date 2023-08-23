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
} from "firebase/firestore";
import { db } from "../../Firebase";
import Image from "next/image";
import { Blockquote } from "@mantine/core";
import { Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// ICONS
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { TiArrowBack } from "react-icons/ti";
import { useForm } from "react-hook-form";
import { addToCart, getSessionUser } from "../../Services/functions";
import Modal from "../../Components/Modal";
import { CartQuantityContext } from "../_app";
import { signIn, useSession } from "next-auth/react";

export async function getStaticPaths() {
  const colRef = collection(db, "memories");
  const snapshot = await getDocs(colRef);
  const paths = snapshot.docs.map((doc) => ({
    params: { productID: doc.id },
  }));

  return { paths, fallback: "blocking" };
}

export const getStaticProps = async ({ params }: { params: any }) => {
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
  // console.log(product);
  const setCartQty = useContext(CartQuantityContext).setCartQty;

  const [disimg, setDisimg] = useState(0);
  const changeIMG = (index: number) => {
    setDisimg(index);
    // console.log(disimg);
    // console.log(pic.current.classList);
  };

  // GO BACK

  function goBack() {
    router.back();
  }

  // fetch product by id
  const [product, setProduct] = useState<any>();
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
  const onSubmit = async (data: any, e: { preventDefault: () => void }) => {
    e.preventDefault();
    // console.log(product);

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

  // toggle review form
  const [showForm, setShowForm] = useState(true);
  // toggle review view

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
      (item: { productID: string | string[] | undefined }) =>
        item.productID === productID
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

  // PAY FUNCTION
  const [payModal, setPayModal] = useState(false);
  const PayNow = async () => {
    const triger = await getSessionUser();
    if (!triger) {
      return setLoginTriger(true);
    }
    setPayModal(true);
  };
  return (
    <>
      {loginTriger && <Modal setLoginTriger={setLoginTriger} />}

      <Group position="center"></Group>
      <Topbar dynamictriger={dynamictriger} />
      <div className="client-single-product">
        <div className="single-product">
          <div className="top-container">
            {" "}
            <div className="big-display-con">
              <button onClick={goBack} className="go-back">
                <TiArrowBack />
                Back
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
            <div className="small-display-img-con">
              {product?.image.map(
                (img: any, index: Key | null | undefined) =>
                  img && (
                    <div className="small-display-img" key={index}>
                      <Image
                        src={img && img}
                        alt="img"
                        fill
                        sizes="100vw"
                        ref={pic}
                        onClick={() => changeIMG(index)}
                      />
                    </div>
                  )
              )}
            </div>
          </div>

          {/* lower part */}
          <div className="lower-details"></div>
        </div>
        <div className="single-product-details">
          <div className="product-review">
            <h1>COMMENTS</h1>
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
              <div className="reviews">
                <p className="review-count">
                  Total of {review.length}{" "}
                  {review.length > 1 ? "comments" : "comment"}
                </p>

                {review.map((comment) => (
                  <div className="quote" key={comment.id}>
                    <Blockquote cite="" className="chatit">
                      <p>{comment.data().username} </p>
                      <sup>
                        <Moment fromNow className="time-posted">
                          {comment.data().timestamp?.toDate()}
                        </Moment>
                      </sup>
                      <p className="quote-text">{comment.data().yourreview}</p>
                    </Blockquote>
                  </div>
                ))}
              </div>
              {/* COMMENT FORM */}
              {session && (
                <div className="review-form-con">
                  {" "}
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
          {similarProducts.length > 0 && (
            <>
              <h3 style={{ marginTop: "100px", color: "#03a8a8" }}>
                {similarProducts.length > 0 && "SIMILAR PRODUCTS"}
              </h3>{" "}
              <div className="similar-products">
                <div className="single-product-con">
                  {similarProducts?.map(
                    (product: {
                      userId: any;
                      id: number;
                      data: () => {
                        posterId: any;
                        id: Key | null | undefined;
                        timestamp: any;
                        (): any;
                        new (): any;
                        image: string;
                        productname: string;
                        productprice: string;
                        productoldprice: string;
                      };
                    }) => (
                      <SimilarProducts
                        key={product?.data()?.id}
                        id={product?.data()?.id}
                        productimages={product?.data()?.image}
                      />
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Details;

function SimilarProducts({
  id,
  productimages,
}: {
  id: any;
  productimages: any;
}) {
  // percentage of peomo

  return (
    <div className="products">
      <div className="product-img">
        <Link
          href={`/ClientDynamic/${id}`}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image
              src={productimages && productimages[0]}
              alt="img"
              className="home-product-img"
              fill
              sizes="100vw"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
