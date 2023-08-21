import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import { BsHeart, BsHeartFill, BsShare } from "react-icons/bs";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
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
                  id: number;
                  data: () => {
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
                    key={product.id}
                    id={product.id}
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
}: {
  id: any;
  productimages: any;
  productname: string;
  productprice: string;
  productoldprice: string;
  setLoginTriger: any;
  timestamp: any;
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
  useEffect(() => {
    if (session) {
      setHasLikes(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      );
    }
  }, [likes]);

  const addToFav = async (id: string) => {
    const productDoc = doc(db, "products", id);
    const productSnapshot = await getDoc(productDoc);
    const productData = productSnapshot.data();
    if (session) {
      if (hasLikes) {
        await deleteDoc(doc(db, "products", id, "likes", session?.user?.uid));
        return;
      } else {
        await setDoc(doc(db, "products", id, "likes", session?.user?.uid), {
          username: session?.user?.username,
        });
        return;
      }
    } else {
      setLoginTriger(true);
    }
  };

  return (
    <div className="products">
      <Link
        href={`/ClientDynamic/${id}`}
        className="main-poster-con"
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <div className="poster-name">
          <div className="profile-img">
            <Image
              src={session?.user?.image}
              height={50}
              width={50}
              className="img"
            />
          </div>
          <div className="profile-name">
            <span>{session?.user?.name?.split(" ")[0]}</span>
            <i>
              <Moment fromNow>{timestamp?.toDate()}</Moment>
            </i>
          </div>
        </div>
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
