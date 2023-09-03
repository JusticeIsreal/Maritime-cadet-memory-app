import React, { useContext, useEffect, useState } from "react";
import Products from "../Components/Memorries/Products";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  DocumentData,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, db2 } from "../Firebase";
import Topbar from "../Components/Topbar";
// import LoginModal from "../Components/LoginModal";
import Modal from "../Components/Modals/LoginModal";
import DynamicPictureModal from "../Components/Modals/dynamicPictureModal";

function memories() {
  const router = useRouter();
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
  // ADD IMAGE TO FAVORITE
  //   const setCartQty = useContext(CartQuantityContext).setCartQty;

  // FILTER THE PICTURES

  const [category, setCategory] = useState<string>("All");
  const [categoryYear, setCategoryYear] = useState<string>("All");
  // state for images
  const [product, setProduct] = useState<any[]>(products);

  // USING SEARCH BAR TO FILTER
  const [search, setSearch] = useState<any>("");
  // filter products based on department
  useEffect(() => {
    if (category === "All" && categoryYear === "All") {
      return setProduct(products);
    }
    if (category === "All" && categoryYear !== "All") {
      return setProduct(
        products?.filter((item) => item.data().pictureyear === categoryYear)
      );
    }
    if (category !== "All" && categoryYear === "All") {
      return setProduct(
        products?.filter((item) => item.data().department === category)
      );
    }
    if (category !== "All" && categoryYear !== "All") {
      return setProduct(
        products?.filter(
          (item) =>
            item.data().department === category &&
            item.data().pictureyear === categoryYear
        )
      );
    }
  }, [category, products, categoryYear]);

  const selectName = [
    ...new Set(products.map((category) => category?.data()?.namesonpicture)),
  ];
  const selectDept = [
    ...new Set(products.map((category) => category?.data()?.department)),
  ];
  const selectLocation = [
    ...new Set(products.map((category) => category?.data()?.picturelocation)),
  ];
  const selectDate = [
    ...new Set(products.map((category) => category?.data()?.pictureyear)),
  ];
  const finalList = [
    ...selectName,
    ...selectDept,
    ...selectLocation,
    ...selectDate,
  ];

  // fetch product by id to triger picture modal
  const [grabDynamicDetails, setGrabDynamicDetails] = useState<any>();
  const [posterDetails, setPosterDetails] = useState<any[]>([]);
  const [postID, setPostID] = useState<any[]>();

  useEffect(() => {
    const getPosterDetails = async () => {
      //   if (grabDynamicDetails?.length > 0) {
      onSnapshot(
        query(collection(db, "registered_Users"), orderBy("time", "desc")),
        (snapshot) => {
          setPosterDetails(
            snapshot.docs.filter(
              (item) => item.data().userId === grabDynamicDetails?.posterId
            )
          );
        }
      );
      // console.log();
    };
    // };
    getPosterDetails();
  }, [grabDynamicDetails]);
  const fetchDetail = posterDetails.map((item) => item.data());

  

  return (
    <div>
      <Topbar
        setPostTriger={setPostTriger}
        newSetFilter={finalList}
        setSearch={setSearch}
        search={search}
      />
      {grabDynamicDetails && (
        <DynamicPictureModal
          grabDynamicDetails={grabDynamicDetails}
          setGrabDynamicDetails={setGrabDynamicDetails}
          fetchDetail={fetchDetail}
          setLoginTriger={setLoginTriger}
          postID={postID}
        />
      )}
      {loginTriger && <Modal setLoginTriger={setLoginTriger} />}

      <Products
        product={product}
        search={search}
        setLoginTriger={setLoginTriger}
        setPostTriger={setPostTriger}
        dynamicBtn={[]}
        setCategory={undefined}
        dynamicDate={[]}
        setCategoryYear={undefined}
        setGrabDynamicDetails={setGrabDynamicDetails}
        setPostID={setPostID}
      />
    </div>
  );
}

export default memories;
