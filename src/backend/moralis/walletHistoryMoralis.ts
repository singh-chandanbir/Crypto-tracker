import Moralis from 'moralis';

const REACT_APP_MORALIS_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjkzMGFlMjBmLTNiZTMtNGE5MS1iNzZjLTQwMzRlMmIwYzUxMCIsIm9yZ0lkIjoiNDAwNzg5IiwidXNlcklkIjoiNDExODM0IiwidHlwZUlkIjoiYzNkNTc1Y2EtZTE0Ny00ZTkyLWE4ZTgtOGQwMDYxZTliMjk1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjE0OTE0MjQsImV4cCI6NDg3NzI1MTQyNH0.yDK78Sa4Ct-4o1OPt1EAA_FXm504T-S9Glu41KgkJI0"
Moralis.start({
  apiKey: REACT_APP_MORALIS_API_KEY as string
});

export interface Transaction {
  transactionId: string;
  fromAddress: string;
  toAddress: string | undefined;
  amount: string;
  date: string;
}

export interface WalletData {
  transactions: Transaction[];
  totalInflow: number;
  totalOutflow: number;
  minTimestamp: string;
  maxTimestamp: string;
}

export async function verifyAddressExists(address: string): Promise<Boolean> {
  try {
    if (!address) {
      throw new Error('Wallet address is required.');
    }
    
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      "address": address
    });
    
  } catch (e) {
    return false
  }
  return true
  
}

export async function getAddressBalance(address: string): Promise<BigInt> {
  try {
    if (!address) {
      throw new Error('Wallet address is required.');
    }
    
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      "address": address
    });

    return BigInt(response.raw.balance)
  } catch (e) {
    console.error(e);
  }
  return BigInt(-1)
}

// Define the function to fetch wallet data
export async function fetchWalletData(address: string): Promise<WalletData> {
  try {
    if (!address) {
      throw new Error('Wallet address is required.');
    }

    // Fetch wallet data from Moralis API
    const response = await Moralis.EvmApi.wallets.getWalletHistory({
      order: 'DESC',
      address: address
    });

    // Check if response has a data property
    if (!response.result || response.result.length === 0) {
      console.log('No transaction history found for this wallet address.');
      return {
        transactions: [],
        totalInflow: 0,
        totalOutflow: 0,
        minTimestamp: '',
        maxTimestamp: ''
      };
    }

    // Extract relevant transaction data and calculate inflows and outflows
    let totalInflow = 0;
    let totalOutflow = 0;
    let minTimestamp = response.result[0].blockTimestamp;
    let maxTimestamp = response.result[0].blockTimestamp;

    const transactions: Transaction[] = response.result.map(transaction => {
      const amount = parseFloat(transaction.value);
      const fromAddress = transaction.fromAddress.lowercase;
      const toAddress = transaction.toAddress?.lowercase;
      
      if (fromAddress === address.toLowerCase()) {
        totalOutflow += amount;
      } else if (toAddress === address.toLowerCase()) {
        totalInflow += amount;
      }

      // Update min and max timestamps
      if (transaction.blockTimestamp < minTimestamp) {
        minTimestamp = transaction.blockTimestamp;
      }
      if (transaction.blockTimestamp > maxTimestamp) {
        maxTimestamp = transaction.blockTimestamp;
      }

      return {
        transactionId: transaction.hash,
        fromAddress: transaction.fromAddress.lowercase,
        toAddress: transaction.toAddress?.lowercase,
        amount: transaction.value,
        date: transaction.blockTimestamp
      };
    });

    return {
      transactions,
      totalInflow,
      totalOutflow,
      minTimestamp,
      maxTimestamp
    };

  } catch (error) {
    // Handle errors and print them to the console
    console.error('Error fetching wallet data:', (error as Error).message);
    return {
      transactions: [],
      totalInflow: 0,
      totalOutflow: 0,
      minTimestamp: '',
      maxTimestamp: ''
    };
  }
}


// // Example usage
// const walletAddress = '0xeB5b7eE01F26B9adC088Ea2e3F66940e27414C92'; // Moonbeam address
// 0xe6d0ED3759709b743707DcfeCAe39BC180C981fe - multi chain
// fetchWalletData(walletAddress);
