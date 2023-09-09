import Link from "next/link";
import Image from "next/image";
import { Key, MouseEvent, useEffect, useState } from "react";
import { BsHeart, BsHeartFill, BsPersonCircle } from "react-icons/bs";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getPlaiceholder } from "plaiceholder";
import { db } from "../../Firebase";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Loader from "../Loader";
import DynamicPictureModal from "../Modals/dynamicPictureModal";
import { arrayBuffer } from "stream/consumers";
interface TypeProps {
  product: any[];
  dynamicBtn: string[];
  setCategory: any;
  search: string;
  setLoginTriger: any;
  dynamicDate: string[];
  setCategoryYear: any;
  setPostTriger: any;
  setGrabDynamicDetails: (value: DocumentData) => void;
  setPostID: (value: any) => void;
}
function Products({
  search,
  product,
  setLoginTriger,
  setPostTriger,
  setGrabDynamicDetails,
  setPostID,
}: TypeProps) {
  // FILTER PICTURES BASED ON INPUT VALUE IN SEARCH
  const approvedPictures = product?.filter(
    (approved) => approved.data().approve === "yes"
  );

  const dd = approvedPictures.map((item) => item.data());

  const newProduct = approvedPictures.filter((item) => {
    if (item.data().namesonpicture === "") {
      return item;
    } else if (
      item.data().namesonpicture.toLowerCase().includes(search?.toLowerCase())
    ) {
      return item;
    } else if (
      item.data().department.toLowerCase().includes(search?.toLowerCase())
    ) {
      return item;
    } else if (
      item.data().pictureyear.toLowerCase().includes(search?.toLowerCase())
    ) {
      return item;
    } else if (
      item.data().namesonpicture.toLowerCase().includes(search?.toLowerCase())
    ) {
      return item;
    } else {
      return "";
    }
  });
  console.log(product);
  return (
    <>
      <>
        {product.length > 0 ? (
          <div className="product-main-con">
            <>
              {newProduct.length < 1 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#219ebc",
                    marginTop: "100px",
                  }}
                >
                  {search}: is not avaliable <br />{" "}
                  <b
                    style={{
                      color: "#219ebc",
                      textDecorationLine: "underline",
                    }}
                    onClick={() => setPostTriger(true)}
                  >
                    Click here to post one
                  </b>
                </p>
              ) : (
                <div className="products-con">
                  {newProduct.map(
                    (product: {
                      userId: string;
                      id: number;
                      data: () => {
                        posterId: any;
                        id: Key | null | undefined;
                        timestamp: any;
                        (): any;
                        new (): any;
                        image: string[];
                        namesonpicture: string;
                        picturelocation: string;
                        pictureyear: number;
                        approve: string;
                        message: any[];
                      };
                    }) => (
                      <Product
                        key={product.data().id}
                        id={product.id}
                        posterId={product.data().posterId}
                        productimages={product.data().image}
                        timestamp={product.data().timestamp}
                        namesonpicture={product.data().namesonpicture}
                        picturelocation={product.data().picturelocation}
                        pictureyear={product.data().pictureyear}
                        message={product.data().message}
                        approve={product.data().approve}
                        setLoginTriger={setLoginTriger}
                        setGrabDynamicDetails={setGrabDynamicDetails}
                        setPostID={setPostID}
                      />
                    )
                  )}
                </div>
              )}
            </>
          </div>
        ) : (
          <Loader />
        )}
      </>
    </>
  );
}

export default Products;

function Product({
  id,
  productimages,
  namesonpicture,
  picturelocation,
  pictureyear,
  approve,
  message,
  setLoginTriger,
  timestamp,
  posterId,
  setGrabDynamicDetails,
  setPostID,
}: {
  id: any;
  productimages: string[];
  namesonpicture: string;
  picturelocation: string;
  pictureyear: number;
  setLoginTriger: any;
  timestamp: any;
  approve: any;
  posterId: any;
  setPostID: any;
  message: any[];
  setGrabDynamicDetails: (value: DocumentData) => void;
}) {
  // GET NEXT AUTH USER SESSION DETAILS
  const { data: session } = useSession();

  // PICTURES LIKE STATE
  const [likes, setLikes] = useState<any>(null);
  const [hasLikes, setHasLikes] = useState<boolean>(false);

  // fetch likes from firebase
  useEffect(() => {
    onSnapshot(collection(db, "memories", id, "likes"), (snapshot) => {
      return setLikes(snapshot.docs);
    });
  }, [db, id]);

  // to unlike logic
  useEffect(() => {
    setHasLikes(
      likes?.findIndex(
        (like: { id: any }) => like.id === (session?.user as { uid: any })?.uid
      ) !== -1
    );
  }, [likes]);

  // LIKE AN IMAGE AND SAME TIME ADD IT TO FAVOURITES
  const addToFav = async (id: string) => {
    if (session) {
      if (hasLikes) {
        await deleteDoc(
          doc(db, "memories", id, "likes", (session?.user as { uid: any })?.uid)
        );
        // return;
      } else {
        await setDoc(
          doc(
            db,
            "memories",
            id,
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
  // fetch product by id
  const getClickedPictureDetails = async (id: any) => {
    const itemRef = doc(db, "memories", id);
    const itemDoc = await getDoc(itemRef);
    setPostID(id);
    if (itemDoc.exists()) {
      const itemData = itemDoc.data();
      setGrabDynamicDetails(itemData);
    } else {
      return null;
    }
  };

  return (
    <div
      className="products"
      data-aos="fade-zoom-in"
      data-aos-offset="500"
      data-aos-easing="ease-in-sine"
      data-aos-duration="600"
    >
      <div className="product-img">
        <span onClick={() => getClickedPictureDetails(id)}>
          <img
            src={productimages[0]}
            alt="img"
            loading="lazy"
            className="home-product-img"
            // placeholderSrc="/Collection of Cherished Moments.png"
            // fill
            // effect="blur"
          />
        </span>
      </div>

      {likes && (
        <div className="likenshare">
          <span className="likenshareicon">
            {hasLikes ? (
              <BsHeartFill
                className="like-red icon"
                style={{ color: "red" }}
                onClick={() => addToFav(id)}
              />
            ) : (
              <BsHeart onClick={() => addToFav(id)} className="icon" />
            )}
            <sub>{likes.length > 0 ? <>{likes.length}</> : null}</sub>
          </span>
        </div>
      )}
    </div>
  );
}
