import React, { useState, useEffect, FormEvent } from "react";
import Info from "@components/info";
import Graph from "@components/graph";
import { verifyAddressExists, fetchWalletData, WalletData } from "@/backend/walletHistorySubscan";

interface SearchProps {
  setWalletID: (walletID: string) => void;
  setEntered: (entered: boolean) => void;
  setValid: (valid: boolean) => void;
  entered: boolean;
  valid: boolean;
}

export default function Search({ setWalletID, setEntered, setValid, entered, valid }: SearchProps) {
  const [wallet, setWallet] = useState("0");
  const [inputValue, setInputValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const walletDataDummy: WalletData = {
    transactions: [],
    totalInflow: 5,
    totalOutflow: 3,
    minTimestamp: '',
    maxTimestamp: ''
  };
  const [walletData, setWalletData] = useState<WalletData>(walletDataDummy);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmittedValue(inputValue);
    setEntered(true);
    verifyAddressExists(inputValue).then(exists =>
      setValid(exists)
    )
    setWallet(inputValue);
    setWalletID(inputValue); // Update wallet ID in Home component
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (value !== submittedValue) {
      setEntered(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  useEffect(() => {
    // Fetch wallet data whenever wallet address changes
    const fetchData = async () => {
      if (wallet && valid) {
        try {
          const data = await fetchWalletData(wallet);
          setWalletData(data);
        } catch (error) {
          console.error('Error fetching wallet data:', error);
          setWalletData(walletDataDummy); // Handle error state
        }
      }
    };

    fetchData();
  }, [valid]); // Dependency array: fetch data when wallet or valid changes

  return (
    <section className="flex flex-col items-center w-full h-payplot-screen bg-background overflow-hidden">
      <div className="flex w-full flex-col items-center flex-[2]">
        <h1 className="text-4xl text-white mt-10 font-bakbak">
          Visualise transactions in{" "}
          <span className="text-purple">seconds</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-center mt-5"
        >
          <input
            type="text"
            placeholder="Enter a wallet address..."
            value={inputValue}
            onChange={handleInputChange}
            className="mt-5 p-2 w-3/4 max-w-md bg-[#616161] text-white placeholder-[#a6a6a6] font-bakbak rounded-[10px]"
          />
        </form>
      </div>
      <div className="flex flex-col items-center w-full flex-[8]">
        {entered ? (
          valid ? (
            <>
              <p className="text-white text-center pt-5">
                Displaying Data for Wallet ID: {wallet}
              </p>
              <div className="flex flex-col w-full mt-5 h-full">
                <button
                  onClick={toggleCollapse}
                  className="p-2 bg-blue-500 text-white rounded-md"
                >
                  {isCollapsed ? "Show Details" : "Hide Details"}
                </button>
                <div className="flex w-full h-full mt-2">
                  <div
                    className={`transition-all duration-300 ease-in-out h-full ${
                      isCollapsed ? "w-0 overflow-hidden" : "w-1/2 pl-5"
                    } bg-background overflow-scroll`}
                  >
                    {!isCollapsed && walletData && (
                      <Info walletID={wallet} walletData={walletData} />
                    )}
                  </div>
                  <div
                    className={`bg-background transition-all duration-300 ease-in-out h-full ${
                      isCollapsed ? "w-full" : "w-1/2"
                    }`}
                  >
                    <Graph walletID={wallet} walletData={walletData} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-white text-center pt-5">
              Invalid Wallet ID. Try again.
            </p>
          )
        ) : (
          <p className="text-white text-center pt-5">
            Type a wallet ID above and hit enter!
          </p>
        )}
      </div>
    </section>
  );
}
