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
import Products2 from "../Components/Homepage/Products2";
import NewsLetter from "../Components/Homepage/NewsLetter";
import Promo from "../Components/Homepage/Promo";
import Footer from "../Components/Footer";
import Modal from "../Components/Modal";
import Review from "../Components/Homepage/Review";
import Advert from "../Components/Homepage/Advert";
import Advantages from "../Components/Advantages";
import { useRouter } from "next/router";
import { addToCart, allCartItem, getSessionUser } from "../Services/functions";
import { CartQuantityContext } from "./_app";

// typescript
interface VariableTypes {
  displayedProducts: any[];
}
const Homepage = () => {
  const router = useRouter();

  // get images from firebase db
  const [loginTriger, setLoginTriger] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);

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
  const addToFav = async (e: { target: { innerHTML: string } }, id: string) => {
    e.target.innerHTML = "Loading ...";
    const productDoc = doc(db, "products", id);
    const productSnapshot = await getDoc(productDoc);
    const productData = productSnapshot.data();
    const triger = await getSessionUser();

    // check if image exist in favourrite
    if (!triger) {
      return setLoginTriger(true);
    }
    const productExist = triger?.userCart.find(
      (item: { productID: string }) => item.productID === id
    );

    if (
      (productExist && !productExist.productID) ||
      productExist === undefined
    ) {
      const cartResponse = await addToCart(productData, id);
      if (cartResponse === "SUCCESS") {
        const userData = await getSessionUser();
        setCartQty(userData?.user.cart.length);
        e.target.innerHTML = "Now In Cart";
        notifications.show({
          title: "Notification",
          message: "Successful , Item added to cart",
        });
      }
    } else {
      notifications.show({
        title: "Notification",
        message: "Failed, Item already in cart",
        color: "red",
      });
      e.target.innerHTML = "Already In Cart";
    }
    if (!triger) {
      return setLoginTriger(true);
    }
  };

  // FILTER THE PICTURES
  const dynamicBtn = [
    "All",
    ...new Set(products.map((category) => category?.data()?.productcategory)),
  ];
  const [category, setCategory] = useState<string>("All");
  // state for products
  const [product, setProduct] = useState<any[]>(products);

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
      <Topbar dynamictriger={undefined} triga={undefined} />

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
            addToFav={addToFav}
          />
          <Advert />
          <Products2 products={products} addToCar={addToFav} />

          {/* SUBSCRIBE */}

          {/* PROMO */}
          <Promo />
          <Advantages />
          {/* REVIEWS */}
          <Review />
          {/* <Advert /> */}
          {/* FOOTER */}
          <Footer />
          {loginTriger && <Modal setLoginTriger={setLoginTriger} />}
        </>
      )}
    </div>
  );
};
// Homepage.requireAuth = true;

export default Homepage;
