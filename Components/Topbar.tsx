import React, { useState, useEffect, FC, ChangeEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button, Group } from "@mantine/core";

interface TopbarProps {
  setSearch: (value: string) => void;
}

const Topbar: FC<TopbarProps> = ({ setSearch }) => {
  const { data: sessions } = useSession();
  const [active, setActive] = useState(0);
  const router = useRouter();

  useEffect(() => {
    switch (router.asPath) {
      case "/":
        setActive(1);
        break;
      case "/products":
        setActive(2);
        break;
      case "/orders":
        setActive(3);
        break;
      default:
        setActive(0);
        break;
    }
  }, [router.asPath]);
  // Handle the case where sessions.user.image might be undefined
  const userImage = sessions?.user?.image || ""; // Provide a default value (empty string) if it's undefined
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="topbar-main-con">
      <div className="topbar-top-con">
        <div className="topbar-top-con-left">
          <Link href="/">
            <img
              style={{ height: "40px" }}
              className="icon"
              src="https://res.cloudinary.com/dk3iqiy2e/image/upload/v1685825962/WhatsApp_Image_2023-05-30_at_12.36.37_AM-removebg-preview_kxnfud.png"
              alt=""
            />
          </Link>
        </div>
        <form>
          <input
            type="text"
            placeholder="Search by cadet name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="topbar-top-con-right">
          {sessions ? (
            <>
              <Drawer
                opened={opened}
                onClose={close}
                title="Settings"
                overlayProps={{ opacity: 0.5, blur: 4 }}
                position="right"
              >
                {/* Drawer content */}
              </Drawer>

              <Group
                position="center"
                className="cart-icon-con"
                onClick={open}
                // onClick={() => signOut()}
              >
                <Image
                  src={userImage}
                  alt="profile"
                  height={50}
                  width={50}
                  style={{ cursor: "pointer" }}
                />
              </Group>
            </>
          ) : (
            <div onClick={() => signIn()}>Login</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
