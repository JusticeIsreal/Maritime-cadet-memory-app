import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { BiSolidSearch } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/router";

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
