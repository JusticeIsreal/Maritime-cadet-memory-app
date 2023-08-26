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
    <div>
      <div>admin</div>
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
    <div>
      <div>
        <Image src={image} alt="h" height={40} width={50} />
      </div>
      <p>{name}</p>
    </div>
  );
}
export default Users;
