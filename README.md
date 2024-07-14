# RupX Cross-Chain Bridge

RupX Cross-Chain Bridge is a decentralized application that enables the transfer of ERC20 tokens between Rupaya testnet and Binance testnet. This project demonstrates the implementation of a cross-chain bridge using smart contracts, a frontend interface, and a relayer service.

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Smart Contracts](#smart-contracts)
- [Frontend](#frontend)
- [Relayer](#relayer)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

```
rupx-bridge/
├── contracts/     # Solidity smart contracts
├── frontend/      # Next.js frontend application
├── relayer/       # Node.js relayer service
├── scripts/       # Deployment and utility scripts
└── test/          # Smart contract tests
```

## Prerequisites

- Node.js (v14 or later)
- Yarn (v1.22 or later)
- Foundry (for smart contract development and testing)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rupx-bridge.git
   cd rupx-bridge
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

## Environment Variables

### Frontend

1. Navigate to the `frontend/` directory
2. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```
3. Open the `.env` file and fill in the values:
   - Set the RPC URLs for Rupaya and Binance testnets
   - Set the deployed bridge contract addresses
   - Set the correct chain IDs
   - (Optional) Set your Web3 API key if using Infura or Alchemy

### Relayer

1. Navigate to the `relayer/` directory
2. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```
3. Open the `.env` file and fill in the values:
   - Set the RPC URLs for Rupaya and Binance testnets
   - Set the deployed bridge contract addresses
   - Set the relayer's private key (keep this secret!)
   - (Optional) Adjust gas price settings and confirmation numbers
   - (Optional) Set up a monitoring webhook URL

Remember to never commit your actual `.env` files to version control, as they may contain sensitive information like private keys.

## Smart Contracts

The smart contracts are located in the `contracts/` directory and are managed using Foundry.

- Compile contracts: `yarn contracts build`
- Run tests: `yarn test`
- Deploy contracts: `yarn contracts script script/deploy.s.sol`

## Frontend

The frontend is a Next.js application located in the `frontend/` directory.

- Run development server: `yarn frontend dev`
- Build for production: `yarn frontend build`
- Start production server: `yarn frontend start`

## Relayer

The relayer service is a Node.js application located in the `relayer/` directory.

- Start the relayer: `yarn relayer start`

## Development

To run the entire stack locally:

1. Deploy the smart contracts to local or test networks:
   ```
   yarn contracts script script/deploy.s.sol
   ```
2. Update the contract addresses in the frontend and relayer `.env` files
3. Start the frontend development server:
   ```
   yarn frontend dev
   ```
4. Run the relayer service:
   ```
   yarn relayer start
   ```

## Testing

- Run smart contract tests:
  ```
  yarn test
  ```
- For frontend tests (if implemented):
  ```
  yarn frontend test
  ```

## Deployment

1. Deploy smart contracts to desired networks using Foundry scripts
2. Build the frontend for production:
   ```
   yarn frontend build
   ```
3. Deploy the frontend to your hosting service of choice
4. Set up the relayer service on a reliable server or cloud platform

Ensure all environment variables are correctly set for production deployments.

## Contributing

We welcome contributions to the RupX Cross-Chain Bridge project! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with clear, descriptive messages
4. Push your changes to your fork
5. Submit a pull request to the main repository

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for more details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Security

If you discover any security-related issues, please email security@rupxbridge.com instead of using the issue tracker.

## Support

If you have any questions or need assistance, please open an issue in the GitHub repository or contact our support team at support@rupxbridge.com.