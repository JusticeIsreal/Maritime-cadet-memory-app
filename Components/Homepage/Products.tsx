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
import { db } from "../../Firebase";
import { useSession } from "next-auth/react";
import Moment from "react-moment";

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
  dynamicBtn,
  dynamicDate,
  setCategoryYear,
  setCategory,
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
    <div className="product-session-con">
      <div className="product-main-con">
        <form>
          <div>
            <label>Select Department</label>
            <select name="" id="" onChange={(e) => setCategory(e.target.value)}>
              {dynamicBtn?.map((category: string, index: number) => (
                <option value={category} key={index}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Select Year</label>
            <select
              name=""
              id=""
              onChange={(e) => setCategoryYear(e.target.value)}
            >
              {dynamicDate?.map((category: string, index: number) => (
                <option value={category} key={index}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </form>

        <>
          {newProduct.length < 1 ? (
            <p style={{ textAlign: "center" }}>
              {search} Not avaliable <br />{" "}
              <b style={{ color: "blue" }} onClick={() => setPostTriger(true)}>
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
    </div>
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
    <div className="products">
      <Link
        href={`/ClientDynamic/${id}`}
        className="main-poster-con"
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <span className="poster-name">
          {posterdetails[0]?.image ? (
            <span className="profile-img">
              <Image
                src={posterdetails[0]?.image}
                alt="img"
                height={50}
                width={50}
                className="img"
              />
            </span>
          ) : (
            <BsPersonCircle className="unknown-avata" />
          )}
          <div className="profile-name">
            <span>{posterdetails[0]?.name.split(" ")[0]}</span>
            <i>
              <Moment fromNow>{timestamp?.toDate()}</Moment>
            </i>
          </div>
        </span>
        <p className="product-name">
          {message[0]?.name ? (
            <span>{message[0]?.name}</span>
          ) : (
            <>
              <b>tags:</b>
              <span>{" " + namesonpicture}</span>
            </>
          )}
        </p>
      </Link>
      <div className="product-img">
        <Link href={`/ClientDynamic/${id}`}>
          <Image
            src={productimages[0]}
            alt="img"
            className="home-product-img"
            fill
            sizes="100vw"
          />
        </Link>
      </div>

      <div className="likenshare">
        <span className="likenshareicon">
          {hasLikes ? (
            <BsHeartFill
              className="like-red"
              style={{ color: "red" }}
              onClick={() => addToFav(id)}
            />
          ) : (
            <BsHeart onClick={() => addToFav(id)} />
          )}
          <sub>{likes.length > 0 ? <>{likes.length}</> : null}</sub>
        </span>
        <span className="comment">
          <a
            
            href={`/ClientDynamic/${id}/#comment`}
            style={{ color: "gray" }}
          >
            {review.length} {review.length > 1 ? "comments" : "comment"}
          </a>
        </span>
      </div>
    </div>
  );
}
