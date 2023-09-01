import Link from "next/link";
import Image from "next/image";
import { Key, useEffect, useState } from "react";
import { BsHeart, BsHeartFill, BsPersonCircle } from "react-icons/bs";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { useSession } from "next-auth/react";
import Moment from "react-moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Loader from "./Loader";

interface TypeProps {
  product: any[];
  dynamicBtn: string[];
  setCategory: any;
  search: string;
  setLoginTriger: any;
  dynamicDate: string[];
  setCategoryYear: any;
  setPostTriger: any;
}
function Products({
  search,
  product,
  setLoginTriger,
  setPostTriger,
}: TypeProps) {
  // FILTER PICTURES BASED ON INPUT VALUE IN SEARCH
  const newProduct = product
    ?.filter((approved) => approved.data().approve === "yes")
    .filter((item) => {
      if (item.data().namesonpicture === "") {
        return item;
      } else if (
        item.data().namesonpicture.toLowerCase().includes(search?.toLowerCase())
      ) {
        return item;
      } else {
        return "";
      }
    });

  return (
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
                  style={{ color: "#219ebc", textDecorationLine: "underline" }}
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
                      image: string;
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
}: {
  id: any;
  productimages: any;
  namesonpicture: string;
  picturelocation: string;
  pictureyear: number;
  setLoginTriger: any;
  timestamp: any;
  approve: any;
  posterId: any;
  message: any[];
}) {
  // console.log(id);
  // GET NEXT AUTH USER SESSION DETAILS
  const { data: session } = useSession();

  // PICTURES LIKE STATE
  const [likes, setLikes] = useState<any[]>([]);
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
      likes.findIndex(
        (like) => like.id === (session?.user as { uid: any })?.uid
      ) !== -1
    );
  }, [likes]);

  // LIKE AN IMAGE AND SAME TIME ADD IT TO FAVOURITES
  const addToFav = async (id: string) => {
    const productDoc = doc(db, "memories", id);
    const productSnapshot = await getDoc(productDoc);
    const productData = productSnapshot.data();
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

  // GET  DETAILS OF POSTER
  const [users, setUsers] = useState<any>([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "registered_Users"), orderBy("time", "desc")),
      (snapshot) => {
        setUsers(snapshot.docs);
      }
    );
  }, [likes]);
  const posterImage = users.filter(
    (user: { data: () => { (): any; new (): any; userId: any } }) =>
      user.data().userId === posterId
  );

  const posterdetails = posterImage.map(
    (img: { data: () => { (): any; new (): any; length: any } }) => img.data()
  );

  // fetch comment rom firebase
  const [review, setReview] = useState<any>([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "memories", id, "review"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setReview(snapshot.docs)
      ),
    [db, id]
  );
  return (
    <div
      className="products"
      data-aos="fade-zoom-in"
      data-aos-offset="500"
      data-aos-easing="ease-in-sine"
      data-aos-duration="600"
    >
      <div className="product-img">
        <Link href={`/ClientDynamic/${id}`}>
          <LazyLoadImage
            src={productimages[0]}
            alt="img"
            loading="lazy"
            className="home-product-img"
            effect="blur"
            placeholderSrc={productimages[0]}
          />
        </Link>
      </div>
      {productimages && (
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
      )}{" "}
    </div>
  );
}
