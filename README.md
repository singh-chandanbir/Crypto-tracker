# Crypto Tracker: The Cross-Chain Transaction Visualization and Analysis Tool

Welcome to Crypto Tracker. This platform is designed to track and visualize blockchain transactions across multiple networks, enhancing transparency and preventing scams through innovative blockchain technology - with features for the blockchain community to contribute easily!

https://github.com/user-attachments/assets/32c2a9b3-facc-46e9-af46-7551f91574bb

## Overview

This project leverages the Polkadot network, Moonbeam parachain, and Solidity smart contracts to build a unified system for monitoring and visualizing transactions across different blockchains. By integrating these technologies, we aim to create a seamless experience for users to track transactions, identify potential scams, and visualize data effectively.

Try it for yourself with these wallet addresses:
- 0xeB5b7eE01F26B9adC088Ea2e3F66940e27414C92
- 0xe6d0ED3759709b743707DcfeCAe39BC180C981fe

## Key Features

- **Multi-Chain Tracking**: Monitor and analyze transactions across various blockchains using Polkadot’s interoperability features.
- **Advanced Visualization**: Use interactive graphs to visualize transaction flows and relationships between addresses.
- **Smart Contract Integration**: Deploy and interact with smart contracts on Moonbeam to manage and verify transactions.
- **User-Driven Credibility Scoring**: A unique smart contract allows users to vote and provide credibility scores for wallet addresses, enhancing transparency and trustworthiness in the ecosystem.
- **Enhanced Security**: Implement features to detect and prevent fraudulent activities using data from Subscan and other sources.
- **Data Analysis**: Utilize Ethers.js to interact with blockchain data and provide detailed insights.

## Technologies Used

- **Polkadot Network**: Provides the multi-chain framework to enable interoperability between different blockchains.
- **Moonbeam Parachain**: Offers Ethereum compatibility, allowing for seamless integration with existing Ethereum-based tools and contracts.
- **Solidity**: Used for writing and deploying smart contracts on Moonbeam.
- **Subscan API**: Provides transaction data and analytics from the Polkadot network.
- **Ethers.js**: Facilitates interaction with blockchain data and smart contracts.

## Smart Contract for Credibility Voting

We have implemented a smart contract on Moonbeam that allows users to:

- **Vote on Wallet Addresses**: Users can cast votes to express their trust or concerns about specific wallet addresses.
- **Provide Credibility Scores**: The smart contract aggregates votes to calculate a credibility score for each wallet address, which is visible to all users.
- **Query and Display Scores**: Retrieve and display credibility scores in the PayPlot application to assist in decision-making and enhance transparency.

## Future Goals

Our vision is to expand this platform to connect more blockchains, offering a unified interface for tracking and visualizing transactions across various networks. By enhancing the interoperability and visualization capabilities, and introducing user-driven credibility scoring, we aim to improve transparency, prevent scams, and create a more integrated decentralized ecosystem.

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hardiv/payplot.git
   ```

2. Navigate to the project directory:
   ```bash
   cd your-repository
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
