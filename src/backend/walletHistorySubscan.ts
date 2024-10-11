import axios from 'axios';

const SUBSCAN_SEARCH_API_URL = 'https://moonbeam.api.subscan.io/api/v2/scan/search';
const SUBSCAN_TRANSFERS_API_URL = 'https://moonbeam.api.subscan.io/api/v2/scan/transfers';
const SUBSCAN_API_KEY = '503a383101ad4ae2937cbe6432a0582b'; 

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

interface Transfer {
  amount: string;
  block_timestamp: number;
  from: string;
  to?: string;
  hash: string;
}

// Function to verify if an address exists
export async function verifyAddressExists(accountAddress: string) {
    try {
        // Define request payload
        const data = JSON.stringify({
            "key": accountAddress
        });

        // Set up the configuration for the API request
        const config = {
            method: 'post',
            url: SUBSCAN_SEARCH_API_URL,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUBSCAN_API_KEY}`
            },
            data: data
        };

        // Make the API request
        const response = await axios(config);

        // Check if the response is successful
        if (response.data.code === 0) {
            const accountData = response.data.data.account;

            // Determine if the account is valid based on the response
            // Assuming that if `address` is returned, the account is valid
            if (accountData.address) {
                return true;
            } else {
                return false;
            }
        } else {
            console.error('Error in API response:', response.data.code, " msg: \n" , response.data.message);
            return false;
        }
    } catch (error) {
        console.error('Error during API request:', error);
        return false;
    }
}

// Function to get the balance of an address
export async function getAddressBalance(address: string): Promise<number> {
  try {
      // Define request payload
      const data = JSON.stringify({
          "key": address
      });

      // Set up the configuration for the API request
      const config = {
          method: 'post',
          url: SUBSCAN_SEARCH_API_URL,
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUBSCAN_API_KEY}`
          },
          data: data
      };

      // Make the API request
      const response = await axios(config);

      // Check if the response is successful
      if (response.data.code === 0) {
          const accountData = response.data.data.account;

          // Check if accountData is valid and contains balance
          if (accountData && accountData.balance) {
              // Return the balance as BigInt
              return accountData.balance; // Adjust if necessary
          } else {
              // Address not found or balance not available
              return -1;
          }
      } else {
          // API responded with an error
          console.error('Error in API response:', response.data.code, " msg: \n" , response.data.message);
          return -1;
      }
  } catch (error) {
      // Handle errors (could be network issues or unexpected problems)
      console.error('Error getting address balance:', error);
      return -1;
  }
}

// Function to fetch wallet data including transaction history
export async function fetchWalletData(address: string): Promise<WalletData> {
  try {
    if (!address) {
      throw new Error('Wallet address is required.');
    }

    const requestBody = JSON.stringify({
      address: address,
      row: 100,
      order: 'desc'
    });

    const config = {
      method: 'post',
      url: SUBSCAN_TRANSFERS_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUBSCAN_API_KEY}`
      },
      data: requestBody
    };

    const response = await axios(config);

    if (response.status === 200 && response.data.code === 0) {
      const transfers: Transfer[] = response.data.data.transfers;

      if (!transfers || transfers.length === 0) {
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
      let minTimestamp = transfers[0].block_timestamp.toString();
      let maxTimestamp = transfers[0].block_timestamp.toString();

      const transactions: Transaction[] = transfers.map((tx: Transfer) => {
        const amount = parseFloat(tx.amount);
        const fromAddress = tx.from.toLowerCase();
        const toAddress = tx.to?.toLowerCase();

        if (fromAddress === address.toLowerCase()) {
          totalOutflow += amount;
        } else if (toAddress === address.toLowerCase()) {
          totalInflow += amount;
        }

        // Update min and max timestamps
        const blockTimestamp = tx.block_timestamp.toString();
        if (blockTimestamp < minTimestamp) {
          minTimestamp = blockTimestamp;
        }
        if (blockTimestamp > maxTimestamp) {
          maxTimestamp = blockTimestamp;
        }

        return {
          transactionId: tx.hash,
          fromAddress: fromAddress,
          toAddress: toAddress,
          amount: tx.amount,
          date: blockTimestamp
        };
      });

      return {
        transactions,
        totalInflow,
        totalOutflow,
        minTimestamp,
        maxTimestamp
      };

    } else {
      console.error('Failed to FETCH FUNC wallet data. Response code:', response.data.code);
      console.log(response)
      return {
        transactions: [],
        totalInflow: 0,
        totalOutflow: 0,
        minTimestamp: '',
        maxTimestamp: ''
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
    } else {
      console.error('Error fetching wallet data:', (error as Error).message);
    }
    return {
      transactions: [],
      totalInflow: 0,
      totalOutflow: 0,
      minTimestamp: '',
      maxTimestamp: ''
    };
  }
}
