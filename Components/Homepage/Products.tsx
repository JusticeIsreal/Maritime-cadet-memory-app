import Link from "next/link";
import Image from "next/image";
import { Key, useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsHeart, BsHeartFill, BsPersonCircle, BsShare } from "react-icons/bs";
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
}
function Products({
  search,
  product,
  dynamicBtn,
  setCategory,
  setLoginTriger,
}: TypeProps) {
  const newProduct = product?.filter((item) => {
    if (item.data().productname === "") {
      return item;
    } else if (
      item.data().productname.toLowerCase().includes(search?.toLowerCase())
    ) {
      return item;
    } else {
      return "";
    }
  });

  return (
    <div className="product-session-con">
      <div className="product-main-con">
        {/* <h1>PRODUCTS</h1> */}
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
            <select name="" id="" onChange={(e) => setCategory(e.target.value)}>
              {dynamicBtn?.map((category: string, index: number) => (
                <option value={category} key={index}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </form>
        {/* PRODUCTS ARRAY */}

        <>
          {newProduct.length < 1 ? (
            <p>No image with Name: {search}</p>
          ) : (
            <div className="products-con">
              {newProduct.map(
                (product: {
                  userId: any;
                  id: number;
                  data: () => {
                    userId: any;
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
                  <Product
                    key={product.data().id}
                    id={product.id}
                    userId={product.data().userId}
                    productimages={product.data().image}
                    timestamp={product.data().timestamp}
                    productname={product.data().productname}
                    productprice={product.data().productprice}
                    productoldprice={product.data().productoldprice}
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
  productname,
  productprice,
  productoldprice,
  setLoginTriger,
  timestamp,
  userId,
}: {
  id: any;
  productimages: any;
  productname: string;
  productprice: string;
  productoldprice: string;
  setLoginTriger: any;
  timestamp: any;
  userId: any;
}) {
  // like image
  const { data: session } = useSession();
  // likes state
  const [likes, setLikes] = useState<any[]>([]);
  const [hasLikes, setHasLikes] = useState<boolean>(false);

  // fetch likes from firebase
  useEffect(() => {
    onSnapshot(collection(db, "products", id, "likes"), (snapshot) => {
      return setLikes(snapshot.docs);
    });
  }, [db, id]);

  // to unlike logic
  // to unlike logic
  useEffect(() => {
    setHasLikes(
      likes.findIndex(
        (like) => like.id === (session?.user as { uid: any })?.uid
      ) !== -1
    );
  }, [likes]);

  const gg = userId;
  const addToFav = async (id: string) => {
    const productDoc = doc(db, "products", id);
    const productSnapshot = await getDoc(productDoc);
    const productData = productSnapshot.data();
    if (session) {
      if (hasLikes) {
        await deleteDoc(
          doc(db, "products", id, "likes", (session?.user as { uid: any })?.uid)
        );
        // return;
      } else {
        await setDoc(
          doc(
            db,
            "products",
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
  // Handle the case where sessions.user.image might be undefined
  const userImage = session?.user?.image || ""; // Provide a default value (empty string) if it's undefined

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
      user.data().userId === userId
  );

  const posterdetails = posterImage.map(
    (img: { data: () => { (): any; new (): any; length: any } }) => img.data()
  );
  console.log(posterdetails[0]);
  console.log(session);
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
            <span>{posterdetails[0]?.name}</span>
            <i>
              <Moment fromNow>{timestamp?.toDate()}</Moment>
            </i>
          </div>
        </span>
        <p className="product-name">hjhhv hjhsg reger eh reheth ethe</p>
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
          <sub>
            {likes.length > 0 ? (
              <>
                {likes.length}
                {likes.length > 1 ? " " + "likes" : " " + "like"}
              </>
            ) : null}
          </sub>
        </span>
        <span className="comment">2 comments</span>
      </div>
    </div>
  );
}
