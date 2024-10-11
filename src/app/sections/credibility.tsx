import React, { useState } from "react";
import { getWalletInfo, upvoteWallet, downvoteWallet } from "@/backend/web3";

interface CredibilityProps {
  walletID: string;
  entered: boolean;
  valid: boolean;
}

export default function Credibility({
  walletID,
  entered,
  valid,
}: CredibilityProps) {
  const [voted, setVoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [credibility, setCredibility] = useState(0);
  const [updated, setUpdated] = useState(false);

  function updateVotes() {
    if (updated || !entered) {
      return
    } else {
      setUpdated(true)
    }
    getWalletInfo(walletID).then((info) => {
      if (info) {
        setUpvotes(info.upvotes);
        setDownvotes(info.downvotes);
        setCredibility(info.credibility);
      }
    });
  }

  updateVotes();

  const handleUpvote = () => {
    setVoted(true);
    upvoteWallet(walletID);
    console.log(`Upvoted wallet ID: ${walletID}`);
    setUpdated(false);
    updateVotes();
  };

  const handleDownvote = () => {
    setVoted(true);
    downvoteWallet(walletID);
    console.log(`Downvoted wallet ID: ${walletID}`);
    setUpdated(false);
    updateVotes();
  };

  return (
    <section className="flex flex-col items-center w-full h-payplot-screen bg-background">
      <div className="flex w-full flex-col items-center flex-[2]">
        <h1 className="text-4xl text-white mt-10 font-bakbak">
          Credibility Information
        </h1>
        {entered && valid ? (
          <>
            <p className="mt-10">Wallet ID: {walletID}</p>
            <p className="mt-10 text-3xl text-[#FF0000]">
              Credibility Score: {credibility}%
            </p>
            <p className="mt-10">Upvotes: {upvotes}</p>
            <p className="mt-10">Downvotes: {downvotes}</p>
            {!voted ? (
              <div className="mt-10 flex space-x-4">
                <button
                  onClick={handleUpvote}
                  className="p-2 bg-[#abbb35] text-white rounded-md"
                >
                  Upvote
                </button>
                <button
                  onClick={handleDownvote}
                  className="p-2 bg-[#ff2060] text-white rounded-md"
                >
                  Downvote
                </button>
              </div>
            ) : (
              <p className="mt-10 text-white text-center">
                Your vote has been cast.
              </p>
            )}
          </>
        ) : (
          <p className="mt-10 text-white text-center">
            {entered
              ? "Invalid Wallet ID. Try again."
              : "Enter a wallet ID on the page above!."}
          </p>
        )}
      </div>
    </section>
  );
}
