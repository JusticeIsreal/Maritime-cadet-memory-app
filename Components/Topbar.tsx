import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiSolidSearch } from "react-icons/bi";
import { PiSignOutBold } from "react-icons/pi";
import Image from "next/image";
import { useRouter } from "next/router";
import { Menu, Button, Text } from "@mantine/core";
interface TopbarProps {
  setSearch: (value: string) => void;
  setPostTriger: any;
  newSetFilter: any[];
  search: string;
}

const Topbar: FC<TopbarProps> = ({
  setSearch,
  setPostTriger,
  newSetFilter,
  search,
}) => {
  // NAVIGATE TO MEMORIE PAGE WHENEVER YOU TRY TO SEARCH
  // FROM THE HOME PAGE

  const router = useRouter();
  useEffect(() => {
    if (search && router.pathname === "/") {
      router.push("/memories");
    }
  }, [router, search]);

  // GET SESSION USER DETAILS FROM NEXT AUTH
  const { data: sessions } = useSession<any>();

  // OPEN AND CLOSE SEARCH DROP DOWN
  const [dropDownCon, setDropDownCon] = useState<boolean>(false);
  const result = newSetFilter?.filter((product) =>
    product.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (search || dropDownCon) {
      setDropDownCon(true);
    } else {
      setDropDownCon(false);
    }

    if (result?.length < 1) {
      setDropDownCon(false);
      closeDropdown();
    }
  }, [search]);

  const closeDropdown = () => {
    if (dropDownCon === true) {
      setDropDownCon(false);
    }
  };

  return (
    <div className="topbar-main-con">
      <div className="topbar-top-con">
        <div className="topbar-top-con-left">
          <Link href="/">
            <img
              style={{ height: "40px" }}
              className="icon"
              src="https://res.cloudinary.com/dd61rrbxs/image/upload/v1694219105/MAN_1_Background_Removed_ocabqo.png"
              alt=""
            />
          </Link>
        </div>

        <div className="topbar-top-con-right">
          <form>
            <BiSolidSearch className="topbar-search-icon" />
            <input
              type="text"
              value={search || ""}
              placeholder="Search by names, department or location..."
              onFocus={() => {
                setDropDownCon(true);
              }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            {dropDownCon && search ? (
              <div className="search-dropdown-con">
                {result?.map((product, index) => (
                  <TopbarSearchOption
                    key={index}
                    product={product}
                    setSearch={setSearch}
                    setDropDownCon={setDropDownCon}
                    closeDropdown={closeDropdown}
                  />
                ))}
              </div>
            ) : null}
          </form>

          {sessions ? (
            <div className="profile-img-con">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Image
                    src={sessions?.user?.image || ""}
                    alt="img"
                    width={50}
                    height={50}
                    className="profile-img"
                    // onClick={() => signOut()}
                  />
                </Menu.Target>

                <Menu.Dropdown style={{ background: "#d8f2ff" }}>
                  <Menu.Label
                    style={{
                      background: "#d8f2ff",
                      display: "flex",
                      // justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => signOut()}
                  >
                    Sign Out{" "}
                    <PiSignOutBold
                      style={{
                        background: "#d8f2ff",
                        marginLeft: "10px",
                      }}
                    />
                  </Menu.Label>
                  <p
                    style={{
                      background: "#d8f2ff",
                    }}
                  >
                    <br />
                    <br />
                  </p>

                  <Menu.Label style={{ background: "#d8f2ff" }}>
                    This platform was
                  </Menu.Label>
                  <a
                    href={`https://wa.me/+2348143221117?text=Hello John, I am ${sessions?.user?.name} from the cadet memory platform you designed.`}
                    target="_blank"
                  >
                    <Menu.Label
                      style={{
                        background: "#d8f2ff",
                        textDecoration: "underline",
                      }}
                    >
                      Designed KO John
                    </Menu.Label>
                  </a>
                  <a
                    href={`https://wa.me/+2348104015180?text=Hello Justice, I am ${sessions?.user?.name} from the cadet memory platform you developed.`}
                    target="_blank"
                  >
                    <Menu.Label
                      style={{
                        background: "#d8f2ff",
                        textDecoration: "underline",
                      }}
                    >
                      Developed by JI Agbonma
                    </Menu.Label>
                  </a>

                  <Menu.Label style={{ background: "#d8f2ff" }}>
                    MAN/18/HND/ME
                  </Menu.Label>
                </Menu.Dropdown>
              </Menu>
            </div>
          ) : (
            <button onClick={() => signIn()}>Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

function TopbarSearchOption({
  product,
  setSearch,
  setDropDownCon,
  closeDropdown,
}: {
  product: any;
  setSearch: (value: string) => void;
  setDropDownCon: (value: boolean) => void;
  closeDropdown: () => void;
}) {
  const selectedName = (e: any) => {
    setSearch(e.target.textContent);
    closeDropdown();
    setDropDownCon(false); // Close the dropdown when an option is clicked
  };

  return (
    <div className="search-dropdown" onClick={(e) => selectedName(e)}>
      <p>{product}</p>
    </div>
  );
}

export default Topbar;
