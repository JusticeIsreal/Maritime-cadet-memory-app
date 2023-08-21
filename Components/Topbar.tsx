import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// import { logOUT } from "../Services/functions";
// import Cookies from "js-cookie";
// ICONS
import { SiCoinmarketcap } from "react-icons/si";
import { FaCartArrowDown } from "react-icons/fa";
import { BsShop, BsWhatsapp } from "react-icons/bs";
import { FiGrid, FiTruck } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { getSessionUser } from "../Services/functions";
import { CartQuantityContext } from "../pages/_app";
import Image from "next/image";

function Topbar({ setSearch }: { setSearch: any }) {
  // SET NAV LIST COLOR WITH PAGE PATH NAME
  const [active, setActive] = useState(0);
  const router = useRouter();

  useEffect(() => {
    switch (router.asPath) {
      case "/":
        setActive(1);
        break;
      case "/products":
        setActive(2);
        break;
      case "/orders":
        setActive(3);
        break;
      default:
        setActive(0);
        break;
    }
  }, [router.asPath]);

  // // FETCHING SESSION USER NAME AND CART LENGTH
  const [name, setName] = useState(null);
  const [cartLength, setCartLength] = useState([]);
  const [session, setSession] = useState([]);
  useEffect(() => {
    async function fetchSessionUser() {
      const userData = await getSessionUser();
      if (userData && userData.user) {
        // setSession(userData);
        setName(userData?.user?.username);
        setCartLength(userData?.user.cart);
      }
    }
    fetchSessionUser();
  }, [router]);
  // console.log(session.user.position);

  return (
    <div className="topbar-main-con">
      {/* TOPBAR  */}
      <div className="topbar-top-con">
        {/* logo side */}
        <div className="topbar-top-con-left">
          <Link href="/">
            <img
              style={{ height: "40px" }}
              className="icon"
              src="https://res.cloudinary.com/dk3iqiy2e/image/upload/v1685825962/WhatsApp_Image_2023-05-30_at_12.36.37_AM-removebg-preview_kxnfud.png"
              alt=""
            />
          </Link>
        </div>
        <form>
          <input
            type="text"
            placeholder="Search by name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {/* cart and user icon */}
        <div className="topbar-top-con-right">
          <div className="cart-icon-con">
            <Image
              src="https://res.cloudinary.com/isreal/image/upload/v1690675954/My%20portfolio%20Project/1671744344371-removebg-preview_dxwbbb_Background_Removed_eh44ec.png"
              alt="profile"
              height={50}
              width={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
