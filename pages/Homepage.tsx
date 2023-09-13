import { useContext, useEffect, useState } from "react";
import Loader from "../Components/Loader";
import { Group } from "@mantine/core";

// firebase
import { db, storage } from "../Firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

// components
import Topbar from "../Components/Topbar";

// import Advert from "../Components/Homepage/Advert";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Banner from "../Components/Banner/Banner";

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
  // console.log(finalList);
  return (
    <div
      className="homepage-main-con"
      style={{
        position: "relative",
        maxWidth: "3000px",
        background: "#001d3d",
      }}
    >
      {/* TOPBAR */}
      {/* <Topbar
        setPostTriger={setPostTriger}
        newSetFilter={finalList}
        setSearch={setSearch}
        search={search}
      /> */}
      {finalList.length < 1 ? (
        <Loader />
      ) : (
        <>
          <Group position="center"></Group>
          <Banner />
        </>
      )}
    </div>
  );
};
// Homepage.requireAuth = true;

export default Homepage;
