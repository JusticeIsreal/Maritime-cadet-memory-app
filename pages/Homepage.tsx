import { useContext, useEffect, useState } from "react";
import Loader from "../Components/Loader";
import { useForm } from "react-hook-form";
import { Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Blockquote } from "@mantine/core";
// firebase
import { db, storage } from "../Firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
// components
import Topbar from "../Components/Topbar";
import Products from "../Components/Homepage/Products";

import Modal from "../Components/Modal";

import Advert from "../Components/Homepage/Advert";

import { useRouter } from "next/router";
import { addToCart, allCartItem, getSessionUser } from "../Services/functions";
import { CartQuantityContext } from "./_app";
import { useSession } from "next-auth/react";

// typescript

const Homepage = () => {
  const router = useRouter();
  // get sesion detail
  const { data: session } = useSession();
  // get images from firebase db
  const [loginTriger, setLoginTriger] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  // likes state
  const [likes, setLikes] = useState([]);
  const [hasLikes, setHasLikes] = useState(false);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "products"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setProducts(snapshot.docs);
      }
    );
  }, [router, loginTriger]);

  // ADD IMAGE TO FAVORITE
  const setCartQty = useContext(CartQuantityContext).setCartQty;

  // FILTER THE PICTURES
  const dynamicBtn = [
    "All",
    ...new Set(products.map((category) => category?.data()?.productcategory)),
  ];
  const [category, setCategory] = useState<string>("All");
  // state for images
  const [product, setProduct] = useState<any[]>(products);

  // USING SEARCH BAR TO FILTER
  const [search, setSearch] = useState<any>("");

  // filter products based on category
  useEffect(() => {
    if (category === "All") {
      setProduct(products);
    } else {
      setProduct(
        products?.filter((item) => item.data().productcategory === category)
      );
    }
  }, [category, products]);

  return (
    <div className="homepage-main-con" style={{ position: "relative" }}>
      {/* TOPBAR */}
      <Topbar
        // dynamictriger={dynamictriger}
        // triga={triga}
        setSearch={setSearch}
      />
      {products.length < 1 ? (
        <Loader />
      ) : (
        <>
          <Group position="center"></Group>
          {/* <Banner /> */}
          <Advert />
          {/* MAIN PRODUCT */}
          <Products
            dynamicBtn={dynamicBtn}
            product={product}
            setCategory={setCategory}
            search={search}
            setLoginTriger={setLoginTriger}
          />
          {loginTriger && <Modal setLoginTriger={setLoginTriger} />}
        </>
      )}
    </div>
  );
};
// Homepage.requireAuth = true;

export default Homepage;
