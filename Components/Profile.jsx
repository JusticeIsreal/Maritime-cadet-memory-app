import React, { useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { SlCallEnd } from "react-icons/sl";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
// import Loader from "../../../Components/Loader";
function CustomerID() {
  // user session

  return (
    <div className="singleuser-con">
      <div className="avatar">
        {/* {userData?.verified === true && (
                <GoVerified className="verified" />
              )} */}
        <RxAvatar />
      </div>
      {/* <h4>{userData?.username}</h4>
            <p>{userData?.userphonenumber}</p>
            <p>{userData?.useremail}</p> */}
      <div className="contact">
        {/* <a target="_blank" href={`tel:${userData?.userphonenumber}`}> */}
        <span>
          <SlCallEnd />
          <p>Call</p>
        </span>
        {/* </a> */}
        {/* <a
                target="_blank"
                href={`https://wa.me/${userData?.userphonenumber}?text=Hello, I am a ${session?.user?.username} from PIUDA `}
              > */}
        <span>
          <BsWhatsapp />
          <p>Whatsapp</p>
        </span>
        {/* </a> */}
        {/* <a target="_blank" href={`mailto:${userData?.useremail}`}> */}
        <span>
          <AiOutlineMail />
          <p>Email</p>
        </span>
        {/* </a> */}
      </div>
    </div>
  );
}

export default CustomerID;
