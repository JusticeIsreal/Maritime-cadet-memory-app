import React from "react";
import { RiFacebookLine, RiTwitterLine } from "react-icons/ri";
import {
  AiOutlineYoutube,
  AiOutlineInstagram,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import Link from "next/link";
import { getSessionUser } from "../Services/functions";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
function Footer() {
  const router = useRouter();
  // FETCHING SESSION USER NAME AND CART LENGTH
  const [userPosition, setUserPosition] = useState();
  useEffect(() => {
    const userName = async () => {
      const userData = await getSessionUser();
      setUserPosition(userData?.user?.position);
    };
    userName();
  }, [userPosition]);

  // // FETCHING SESSION USER NAME AND CART LENGTH
  const [name, setName] = useState("");
  const [cartLength, setCartLength] = useState([]);
  const [session, setSession] = useState([]);
  useEffect(() => {
    async function fetchSessionUser() {
      const userData = await getSessionUser();
      if (userData && userData.user) {
        setSession(userData);
        setName(userData?.user?.username);
        setCartLength(userData?.user.cart);
      }
    }
    fetchSessionUser();
  }, [router]);
  // console.log(userPosition);

  // LOGOUT
  const logOUT = () => {
    Cookies.remove("JWTtoken");
    location.reload();
    router.push("/");
    // localStorage.removeItem("reLogin");
  };
  return (
    <div className="footer-main-con">
      <div className="footer-con">
        <div className="top-con">
          <div className="img-con">
            <img
              src="https://res.cloudinary.com/dk3iqiy2e/image/upload/v1685825962/WhatsApp_Image_2023-05-30_at_12.36.37_AM-removebg-preview_kxnfud.png"
              alt="img"
            />
          </div>
          {/* <p>RSO/Shipping/Marine/Procurement/Logistics</p> */}
          <div className="icon-con">
            <RiFacebookLine className="icon" />
            <AiOutlineYoutube className="icon" />
            <AiOutlineInstagram className="icon" />
            <RiTwitterLine className="icon" />
            <AiOutlineWhatsApp className="icon" />
          </div>
        </div>
        <div className="lower-con">
          <div className="quick-link">
            <h3>Navigate</h3>
            <Link href="/" className="links">
              Home
            </Link>
            <Link href="/products" className="links">
              Products
            </Link>
            <Link href="/orders" className="links">
              Orders
            </Link>
            <a
              href="https://wa.me/+2348067279806?text=Hello, I am a customer on your platfor 'House of Hilda' and I need your support."
              className="links"
            >
              Support
            </a>
          </div>

          <div className="quick-link">
            <h3>Other Links</h3>
            <Link href="/team" className="links">
              Company profile
            </Link>
            {userPosition === "admin" || userPosition === "staff" ? (
              <Link href="/Adminpage/AdminDashboard" className="links">
                <i></i>Admin Login
              </Link>
            ) : (
              ""
            )}
            {name ? (
              <button
                style={{
                  height: "70%",
                  color: "#e9a321",
                  cursor: "pointer",
                  border: ".1px solid #e9a321",
                  width: "100px",
                }}
                onClick={() => logOUT()}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/loginpage"
                style={{
                  height: "70%",
                  cursor: "pointer",
                  width: "100px",
                }}
              >
                <button
                  style={{
                    height: "100%",
                    color: "#e9a321",
                    cursor: "pointer",
                    border: ".1px solid #e9a321",
                    width: "100px",
                    cursor: "pointer",
                  }}
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
          <div className="quick-link">
            <h3>Contact</h3>
            <p className="links">
              <b>E-mail Address: </b>
              <a href="mailto:piudaonline@yahoo.com">
                HOUSEOFHILDA.ng@gmail.com
              </a>{" "}
            </p>
            <p className="links">
              <b>Physical Address:</b> No 12 Okumose Street off Ekosodin road,
              Evbuomore Quarters Ugbowo ,Benin City Edo State
            </p>
            <p className="links">(+234) 806 727 9806</p>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>
          Copyright © House of Hilda {new Date().getFullYear()}. All Rights
          Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
