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
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
// components
import Topbar from "../Components/Topbar";
import Products from "../Components/Products";

import Modal from "../Components/Modal";

// import Advert from "../Components/Homepage/Advert";

import { useRouter } from "next/router";
import { addToCart, allCartItem, getSessionUser } from "../Services/functions";
import { CartQuantityContext } from "./_app";
import { useSession } from "next-auth/react";
import AddNewMemory from "../Components/AddNewMemory";
import AddMemoryModal from "../Components/AddMemoryModal";
import Banner from "../Components/Banner/Banner";
import Slider from "../Components/Slider";

// typescript

const Homepage = () => {
  const router = useRouter();
  // get sesion detail
  const { data: session } = useSession();
  // get images from firebase db
  const [loginTriger, setLoginTriger] = useState<boolean>(false);
  const [postTriger, setPostTriger] = useState<any>(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "memories"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setProducts(snapshot.docs);
      }
    );
  }, [router, loginTriger]);

  // USING SEARCH BAR TO FILTER
  const [search, setSearch] = useState<any>("");

  const selectName = [
    "All",
    ...new Set(products.map((category) => category?.data()?.namesonpicture)),
  ];
  return (
    <div
      className="homepage-main-con"
      style={{
        position: "relative",
        maxWidth: "3000px",
      }}
    >
      {/* TOPBAR */}
      <Topbar
        setPostTriger={setPostTriger}
        newSetFilter={selectName}
        setSearch={setSearch}
        search={search}
      />
      {products.length < 1 ? (
        <Loader />
      ) : (
        <>
          <Group position="center"></Group>
          <Banner />
          {/* <Slider /> */}
          {/* MAIN PRODUCT */}
        </>
      )}
      {loginTriger && <Modal setLoginTriger={setLoginTriger} />}
      {postTriger && <AddMemoryModal setPostTriger={setPostTriger} />}
      {/* <AddNewMemory
        setPostTriger={setPostTriger}
        setLoginTriger={setLoginTriger}
      /> */}
    </div>
  );
};
// Homepage.requireAuth = true;

export default Homepage;
