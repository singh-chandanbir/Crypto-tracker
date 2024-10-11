import React from "react";
import { Transaction } from "@/backend/walletHistorySubscan";

interface TransactionProps {
  key: number,
  transaction: Transaction
}

function formatDate(timestampStr: string): string {
  // Convert the string to a number
  const timestamp = parseInt(timestampStr, 10);

  // Check if the conversion was successful and the timestamp is valid
  if (isNaN(timestamp)) {
    throw new Error("Invalid timestamp");
  }

  // Convert the timestamp from seconds to milliseconds
  const date = new Date(timestamp * 1000);

  // Extract day, month, and year
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const year = String(date.getUTCFullYear()).slice(-2); // Get last 2 digits of year

  // Return formatted date string
  return `${day}/${month}/${year}`;
}


function TransactionWidget (props: TransactionProps) {
  const transaction = props.transaction;
  
  return (
    <div
      className="mb-2 mr-2 rounded-md p-4 bg-opacity-85 bg-purple"
      
    >
      <p className="text-white mb-1">ID : {transaction.transactionId.slice(0,45)+"..."}</p>
      <p className="text-xs">
        Transferred {transaction.amount} from {transaction.fromAddress.slice(0,5)} to {transaction.toAddress ? transaction.toAddress.slice(0,5) : null} on {formatDate(transaction.date)}
      </p>
    </div>

  );
};

export default TransactionWidget;
