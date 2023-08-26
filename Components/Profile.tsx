import React, { useEffect, useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { SlCallEnd } from "react-icons/sl";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../Firebase";
import Image from "next/image";
// import Loader from "../../../Components/Loader";
function CustomerID() {
  // user session
  const { data: session } = useSession();
  const [pictures, setPictures] = useState<any[]>([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "registered_Users"), orderBy("time", "desc")),
      (snapshot) => {
        setPictures(snapshot.docs);
      }
    );
  }, [session]);

  // const openPicture = pictures.map((pic) => pic.data());
  const openPictures = pictures.map((pic) => pic.data());
  const userposts = openPictures.filter(
    (post) => post?.userId === (session?.user as { uid: any })?.uid
  );

  console.log(userposts[0]);

  return (
    <div className="singleuser-con">
      <div className="avatar">
        <div className="user-profile-image">
          <Image
            className="imgQ"
            src={userposts[0]?.image}
            alt="img"
            // fill
            // sizes="100vw"
            width={50}
            height={50}
          />
        </div>
        <h3>{userposts[0]?.name}</h3>
        <p>{userposts[0]?.email}</p>
        <p>{userposts[0]?.phone_number}08104015180</p>
        <p>{userposts[0]?.year_of_ad}2020-2023</p>
        <p>{userposts[0]?.department}M-Engr</p>
        {/* <p>{userposts[0]?.position_held}CCC</p> */}
      </div>
    </div>
  );
}

export default CustomerID;
