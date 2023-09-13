import React, { useContext, useEffect, useState } from "react";
import Products from "../Components/Memorries/Products";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, db2 } from "../Firebase";
import Topbar from "../Components/Topbar";
import Modal from "../Components/Modals/LoginModal";
import DynamicPictureModal from "../Components/Modals/dynamicPictureModal";
import AddNewMemory from "../Components/AddNewMemory";
import AddMemoryModalForm from "../Components/Modals/AddMemoryModalForm";

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
  }, [router]);

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
  const [postID, setPostID] = useState<any>("");

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
    };

    // };
    getPosterDetails();
  }, [grabDynamicDetails]);

  const fetchDetail = posterDetails.map((item) => item.data());
  const { data: sessions } = useSession();
  const [isSessionSaved, setIsSessionSaved] = useState(false);
  const saveSession = async () => {
    if (sessions && !isSessionSaved) {
      const usersRef = collection(db2, "registered_Users");
      const q = query(usersRef, where("email", "==", sessions?.user?.email));

      try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(usersRef, {
            name: sessions?.user?.name,
            email: sessions?.user?.email,
            image: sessions?.user?.image,
            userId: (session?.user as { uid: any })?.uid,
            phone_number: "",
            department: "",
            startyear: "",
            endyear: "",
            time: serverTimestamp(),
          });
          console.log("User added to signedInUsers collection", session);
          setIsSessionSaved(true);
        } else {
          console.log("User already exists in signedInUsers collection");
          setIsSessionSaved(true);
        }
      } catch (error) {
        console.error("Error saving session data:", error);
      }
    }
  };

  useEffect(() => {
    saveSession();
  }, [sessions]);
  return (
    <div
      className="memory-main"
      // style={{ background: "#001d3d" }}
    >
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
          setPostID={setPostID}
          pictures={products}
          setSearch={setSearch}
        />
      )}

      {loginTriger && <Modal setLoginTriger={setLoginTriger} />}

      {postTriger && <AddMemoryModalForm setPostTriger={setPostTriger} />}
      <AddNewMemory
        setPostTriger={setPostTriger}
        setLoginTriger={setLoginTriger}
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
        setGrabDynamicDetails={setGrabDynamicDetails}
        setPostID={setPostID}
      />
    </div>
  );
}

export default memories;
