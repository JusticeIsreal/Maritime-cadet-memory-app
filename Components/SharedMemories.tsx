import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import Moment from "react-moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function SharedMemories() {
  const { data: session } = useSession();
  const [pictures, setPictures] = useState<any[]>([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "memories"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPictures(snapshot.docs);
      }
    );
  }, [session]);

  const openPictures = pictures.map((pic) => pic);
  const userposts = openPictures.filter(
    (post) => post.data().posterId === (session?.user as { uid: any })?.uid
  );

  return (
    <>
      {userposts.length < 1 ? (
        ""
      ) : (
        <div className="sharedMemory">
          {userposts?.map((item) => (
            <SharedMemory
              key={item.id}
              id={item.id}
              image={item.data().image}
              timestamp={item.data().timestamp}
            />
          ))}
        </div>
      )}{" "}
    </>
  );
}

function SharedMemory({
  id,
  image,
  timestamp,
}: {
  id: string;
  image: any;
  timestamp: any;
}) {
  const router = useRouter();

  const reloadRoute = async () => {
    await router.push(`/ClientDynamic/${id}`);
    location.reload();
  };
  return (
    <div className="myMemoryCon">
      <Link href={`/ClientDynamic/${id}`} onClick={() => reloadRoute()}>
        <Image className="imgQ" src={image[0]} alt="img" fill sizes="100vw" />
      </Link>
    </div>
  );
}

export default SharedMemories;
