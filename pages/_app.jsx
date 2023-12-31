import Head from "next/head";
import "../styles/Topbar/Topbar.css";
import "../styles/Banner/Banner.css";
import "../styles/memorypage/memory.css";
import "../styles/Modal/modals.css";
import "../styles/HomePage/Style.css";
// import "../styles/AdminPage/App.css";

// import "../styles/DynamicPage/adminSingleproduct/style.css";
// import "../styles/DynamicPage/transactionreceipt/style.css";
// import "../styles/CartPage/style.css";
// import "../styles/Paginate/pagenate.css";
import { AppProps } from "next/app";
import { createContext, useEffect, useState } from "react";
import Loader from "../Components/Loader";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
// mantine
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import axios from "axios";
import Cookies from "js-cookie";
export const CartQuantityContext = createContext();

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [preRender, setPreRender] = useState(true);
  const [cartQty, setCartQty] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState(false);
  // useEffect(() => {
  //   setPreRender(true);

  return (
    <SessionProvider session={session}>
      <div
        style={{
          background: "#001d3d",
        }}
      >
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />

          <meta name="description" content="Description" />
          <meta name="keywords" content="Keywords" />
          <title>Academy Acrchive</title>

          <link rel="manifest" href="/manifest.json" />
          <link
            href="https://res.cloudinary.com/dd61rrbxs/image/upload/v1694548857/MARITIME_FILE_Background_Removed_nw5w3n.png"
            rel="icon"
            type="image/png"
            sizes="16x16"
          />
          <link
            href="https://res.cloudinary.com/dd61rrbxs/image/upload/v1694548857/MARITIME_FILE_Background_Removed_nw5w3n.png"
            rel="icon"
            type="image/png"
            sizes="32x32"
          />
          <link
            rel="apple-touch-icon"
            href="https://res.cloudinary.com/dd61rrbxs/image/upload/v1694548857/MARITIME_FILE_Background_Removed_nw5w3n.png"
          ></link>
          <meta name="theme-color" content="white" />
        </Head>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <Notifications position="top-right" zIndex={2077} />
          <CartQuantityContext.Provider value={{ cartQty, setCartQty }}>
            {preRender ? (
              <>
                {Component.requireAuth ? (
                  <AuthGuard>
                    <Component {...pageProps} />
                    <Analytics />
                  </AuthGuard>
                ) : (
                  <>
                    <Component {...pageProps} />
                    <Analytics />
                  </>
                )}
              </>
            ) : (
              <div style={{ marginTop: "200px" }}>
                <Loader />
              </div>
            )}
          </CartQuantityContext.Provider>
        </MantineProvider>
      </div>
    </SessionProvider>
  );
}
