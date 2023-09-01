import React, { useContext, useEffect, useState } from "react";
import Products from "../Components/Products";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../Firebase";
import Topbar from "../Components/Topbar";

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
  const dynamicName = [
    "All",
    ...new Set(products.map((category) => category?.data()?.namesonpicture)),
  ];
  const dynamicDate = [
    "All",
    ...new Set(products.map((category) => category?.data()?.pictureyear)),
  ];

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
  //   console.log(dynamicName);
  const newSetFilter = products
    ?.filter((approved) => approved.data().approve === "yes")
    .filter((item) => {
      if (item.data().namesonpicture === "") {
        return item;
      } else if (
        item.data().namesonpicture.toLowerCase().includes(search?.toLowerCase())
      ) {
        return item;
      } else {
        return null;
      }
    });
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
  return (
    <div>
      <Topbar
        setPostTriger={setPostTriger}
        newSetFilter={finalList}
        setSearch={setSearch}
        search={search}
      />
      <Products
        product={product}
        search={search}
        setLoginTriger={setLoginTriger}
        setPostTriger={setPostTriger}
        dynamicBtn={[]}
        setCategory={undefined}
        dynamicDate={[]}
        setCategoryYear={undefined}
      />
    </div>
  );
}

export default memories;
