import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import Image from "next/image";

function Users() {
  // get user session
  const { data: session } = useSession();
  // get all user
  const [user, setUser] = useState<any[]>([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "registered_Users"), orderBy("time", "desc")),
      (snapshot) => {
        setUser(snapshot.docs);
      }
    );
  }, []);
  //   get array of users
  const allUsers = user.map((item) => item.data());
  console.log(allUsers);
  return (
    <div className="user-con">
      <div>
        <div className="single-use-con  admin-con">
          <h3>Admin</h3>
          <div className="user-img-con">
            <Image
              src="https://res.cloudinary.com/isreal/image/upload/v1675303651/My%20portfolio%20Project/1671744344371_ovpmot.jpg"
              alt="h"
              height={40}
              width={50}
            />
          </div>
          <div className="user-email-name">
            <p>Justice Agbonma</p>
            <p>+2348104015180</p>
            <p>Justiceyba@gmail.com</p>
          </div>
        </div>
      </div>
      <h4 style={{ marginTop: "20px" }}>Registered Cadets</h4>
      <div>
        {allUsers.map((item) => (
          <SingleUsers key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

function SingleUsers({
  name,
  email,
  image,
  userId,
  phone_number,
  department,
  startyear,
  endyear,
}: {
  name: any;
  email: any;
  image: any;
  userId: any;
  phone_number: any;
  department: any;
  startyear: any;
  endyear: any;
}) {
  return (
    <div className="single-use-con">
      <div className="user-img-con">
        <Image src={image} className="img" alt="h" height={40} width={50} />
      </div>
      <div className="user-email-name">
        <p>{name}</p>
        <p>{email}</p>
      </div>
    </div>
  );
}
function AdminUsers({
  name,
  email,
  image,
  userId,
  phone_number,
  department,
  startyear,
  endyear,
}: {
  name: any;
  email: any;
  image: any;
  userId: any;
  phone_number: any;
  department: any;
  startyear: any;
  endyear: any;
}) {
  return (
    <div className="single-use-con">
      <div className="user-img-con">
        <Image src={image} alt="h" height={40} width={50} />
      </div>
      <div className="user-email-name">
        <p>{name}</p>
        <p>{email}</p>
      </div>
    </div>
  );
}
export default Users;
