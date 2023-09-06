import React, { useState, useEffect } from "react";
// firebase imports
import { db, storage } from "../../Firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

// COMPONENTS
import Topbar from "../../Components/AdminPageComponents/Topbar";
import Sidebar from "../../Components/AdminPageComponents/Sidebar";

// ICONS
import Link from "next/link";
import { useRouter } from "next/router";

function Store() {
  // display form on and of
  const [formShow, setFormShow] = useState(false);

  // SFETCHIN PRODUCCTS SORTED FROM FIREBABSE
  const [advertDetails, setAdvertDetails] = useState([]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "advert"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setAdvertDetails(snapshot.docs);
      }
    );
  }, [db]);
  // SFETCHIN PRODUCCTS SORTED FROM FIREBABSE
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "memories"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setProductDetails(snapshot.docs);
      }
    );
  }, [db]);
  // SFETCHIN BANNER SORTED FROM FIREBABSE
  const [bannerDetails, setBannerDetails] = useState([]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "banneritems"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setBannerDetails(snapshot.docs);
      }
    );
  }, [db]);

  // ALLOW ONLY ADMI AND STAFF ACCESS
  const [userPosition, setUserPosituon] = useState("admin");
  const router = useRouter();
  // useEffect(() => {
  //   const userInfo = async () => {
  //     const userData = await getSessionUser();
  //     setUserPosituon(userData?.user?.position);

  //     if (userPosition === "client") {
  //       router.push("/");
  //     }
  //   };
  //   userInfo();
  // }, [userPosition, router]);
  return (
    <div className="store-main-con">
      {userPosition === "admin" || userPosition === "staff" ? (
        <>
          {" "}
          <Topbar />
          <Sidebar />
          <div id="content">
            <main>
              <div className="head-title">
                <div className="left">
                  <h1>Store</h1>

                  <ul className="breadcrumb">
                    <li>
                      <a href="#">Dashboard</a>
                    </li>
                    <li>
                      <i className="bx bx-chevron-right"></i>
                    </li>
                    <li>
                      <Link
                        className="active"
                        href="#"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        | Store
                      </Link>
                    </li>
                  </ul>
                </div>
                <div
                  className="btn-download"
                  onClick={() => setFormShow(!formShow)}
                >
                  <b className="bx bxs-cloud-download"> + </b>
                  <span className="text">
                    {formShow ? "Close Table" : "Add Product"}
                  </span>
                </div>
              </div>
              {formShow && (
                <div className="store-form-container">
                  <AdvertForm advertDetails={advertDetails} />
                  <BannerForm />
                  {/* PRODUCTS TABLE */}
                  <ProductForm />
                </div>
              )}
              {/* <AdvertItems advertDetails={advertDetails} /> */}
              {/* <BannerItems bannerDetails={bannerDetails} /> */}
              {/* <StoreItems productDetails={productDetails} /> */}
            </main>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
// Store.requireAuth = true;
export default Store;
