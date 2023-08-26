import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../Firebase";
import Image from "next/image";

function CustomerID() {
  // user session
  const { data: session } = useSession();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "registered_Users"), orderBy("time", "desc")),
      (snapshot) => {
        setAllUsers(snapshot.docs);
      }
    );
  }, [session]);

  // filter user from users array
  const openPictures = allUsers.map((pic) => pic.data());
  const userposts = openPictures.filter(
    (post) => post?.userId === (session?.user as { uid: any })?.uid
  );

  return (
    <div className="singleuser-con">
      <div className="avatar">
        <div className="user-profile-image">
          <Image
            className="imgQ"
            src={userposts[0]?.image}
            alt="img"
            width={50}
            height={50}
          />
        </div>
        <div className="user-list">
          {userposts[0]?.name.split(" ").length > 1 ? (
            <h3>
              {userposts[0]?.name.split(" ")[0]}{" "}
              {userposts[0]?.name.split(" ")[1]}
            </h3>
          ) : (
            <h3>{userposts[0]?.name.split(" ")[0]}</h3>
          )}

          <p>{userposts[0]?.email}</p>
          <p>{userposts[0]?.phone_number}</p>
          <p>
            {userposts[0]?.startyear} - {userposts[0]?.endyear}
          </p>
          <p>{userposts[0]?.department}</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerID;
