import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../Firebase";
import { useSession } from "next-auth/react";

function EditProfile() {
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

  // get specific user based on user session id
  const specificUser = allUsers.filter(
    (name) => name.userId === (session?.user as { uid: any })?.uid
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // update the user details
  const onSubmit = async (data: any, e: any) => {
    e.preventDefault();

    //   create object of udated info
    const editedDetails = {
      phone_number: data.phone_number
        ? data.phone_number
        : specificUser[0]?.phone_number,
      department: data.department
        ? data?.department
        : specificUser[0]?.department,
      startyear: data.startyear ? data?.startyear : specificUser[0]?.startyear,
      endyear: data.endyear ? data?.endyear : specificUser[0]?.endyear,
    };

    try {
      // Query the collection to find the user document with session id
      const querySnapshot = await getDocs(collection(db, "registered_Users"));
      querySnapshot.forEach(async (doc) => {
        const userData = doc.data();
        if (userData.userId === (session?.user as { uid: any })?.uid) {
          // Update the details of the user with matching email
          const docRef = doc.ref; // Use doc.ref to get the document reference
          await updateDoc(docRef, editedDetails);
        }
      });
      alert("User's details updated successfully!");
    } catch (error) {
      console.error(error);
    }

    reset();
  };

  // get array of years
  const yearStart = Array.from({ length: 2023 - 1979 + 1 }, (_, index) =>
    index === 0 ? "" : 1979 + index
  );
  const yearEnd = Array.from({ length: 2023 - 1979 + 1 }, (_, index) =>
    index === 0 ? "" : 1979 + index
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
      <input
        type="text"
        placeholder="Enter phone number"
        {...register("phone_number")}
      />
      <select {...register("department")}>
        <option value="" key="">
          Your department
        </option>
        <option value="ME" key="">
          ME
        </option>
        <option value=" NS" key="">
          NS
        </option>
        <option value="EE" key="">
          EE
        </option>
        <option value="HYD" key="">
          HYD
        </option>
        <option value="MET" key="">
          MET
        </option>
        <option value="MTBS" key="">
          MTBS
        </option>
        <option value="MTBM" key="">
          MTBM
        </option>
      </select>
      {/* department */}
      <div className="select-con">
        <p>
          {/* <span>Start</span> */}
          <span>First Year</span>
          <span>to</span>
          <span>Grad Year</span>
        </p>
        <div>
          <select {...register("startyear")}>
            {yearStart?.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
          <select {...register("endyear")}>
            {yearEnd?.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input type="submit" />
    </form>
  );
}

export default EditProfile;
