import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Homepage from "./Homepage";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db2 } from "../Firebase";
// import Homepage from "./Homepage";

// PAGES

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  const [isSessionSaved, setIsSessionSaved] = useState(false);

  const saveSession = async () => {
    if (session && !isSessionSaved) {
      const usersRef = collection(db2, "registered_Users");
      const q = query(usersRef, where("email", "==", session.user.email));

      try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(usersRef, {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            userId: session.user.uid,
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
  }, [session]);
  return (
    <section className="oo">
      <Head>
        <title>Academy Acrchive</title>
        <meta
          name="description"
          content="Designed and Developed by K0 John and JI Agbonma (MAN/18/ME/HND)"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://res.cloudinary.com/dd61rrbxs/image/upload/v1694548857/MARITIME_FILE_Background_Removed_nw5w3n.png"
        />
      </Head>
      <main className="app-main-con">
        {/* HOOME PAE */}
        {/* <button onClick={signIn}>out</button> */}
        <Homepage />
      </main>
    </section>
  );
}
