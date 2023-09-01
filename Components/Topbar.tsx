import React, { useState, useEffect, FC, ChangeEventHandler } from "react";
import Link from "next/link";

import { signIn, useSession } from "next-auth/react";

import { BiSolidSearch } from "react-icons/bi";
import Image from "next/image";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../Firebase";

interface TopbarProps {
  setSearch: (value: string) => void;
  setPostTriger: any;
}

const Topbar: FC<TopbarProps> = ({ setSearch, setPostTriger }) => {
  const { data: sessions } = useSession<any>();

  return (
    <div className="topbar-main-con">
      <div className="topbar-top-con">
        <div className="topbar-top-con-left">
          <Link href="/">
            <img
              style={{ height: "40px" }}
              className="icon"
              src="/Mémoire 18.png"
              alt=""
            />
          </Link>
        </div>

        <div className="topbar-top-con-right">
          <form>
            <BiSolidSearch className="topbar-search-icon" />
            <input
              type="text"
              placeholder="Search by names, department or location..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {sessions ? (
            <div className="profile-img-con">
              <Image
                src={sessions?.user?.image || ""}
                alt="img"
                width={50}
                height={50}
                className="profile-img"
              />
            </div>
          ) : (
            <button onClick={() => signIn()}>Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
