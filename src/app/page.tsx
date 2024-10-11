"use client";
import { useEffect, useState } from "react";

import "@styles/style.css";
import NavBar from "@/app/components/navbar";
import Search from "@/app/sections/search";
import { fetchWalletData, getAddressBalance, verifyAddressExists } from "@/backend/walletHistorySubscan";
import Credibility from "./sections/credibility";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [walletID, setWalletID] = useState(""); // State for wallet ID
  const [entered, setEntered] = useState(false); // State for entered
  const [valid, setValid] = useState(false); // State for valid
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <head>
        <title>Home | PayPlot</title>
      </head>
      <body>
        <div className="min-h-screen w-full">
          <NavBar scrolled={scrolled} />
          <div className="flex-grow mt-navbar">
            <Search 
              setWalletID={setWalletID} 
              setEntered={setEntered} 
              setValid={setValid} 
              entered={entered} 
              valid={valid}
            />  {/* Pass setWalletID, setEntered, setValid, entered, valid to Search */}
            <Credibility walletID={walletID} entered={entered} valid={valid} />  {/* Pass walletID, entered, valid to Credibility */}
          </div>
        </div>
      </body>
    </>
  );
}
