# OrbitPay: Stellar Testnet Payment dApp

## Project Overview

OrbitPay is a decentralized payment application built on the **Stellar Testnet** that enables users to send XLM transactions seamlessly through an intuitive, modern interface. Designed as a gateway into Stellar blockchain development, OrbitPay demonstrates core Stellar capabilities — wallet integration, balance management, and peer-to-peer payments — all within a polished, responsive UI.

By leveraging the Freighter wallet and Stellar's Horizon API, OrbitPay provides a complete end-to-end payment flow: connect your wallet, fund your account via Friendbot, and send XLM to any valid Stellar address with real-time transaction feedback.

### Core Concepts on Stellar

| OrbitPay Feature | Stellar Mechanism | Purpose |
|---|---|---|
| Wallet Connection | Freighter API (`requestAccess`, `getPublicKey`) | Secure, non-custodial wallet authentication |
| Balance Display | Horizon REST API (`loadAccount`) | Real-time XLM balance from the Stellar ledger |
| Send Payment | `TransactionBuilder` + `signTransaction` | Build, sign, and submit XLM payment operations |
| Account Funding | Friendbot Faucet | One-click testnet XLM for new accounts |
| Transaction Feedback | Horizon `submitTransaction` response | Hash, explorer link, and success/failure status |

## Features

### Wallet Integration
- **Connect & Disconnect** — Seamlessly link your Freighter wallet with a single click. The app detects whether Freighter is installed and prompts for access approval.
- **Address Display** — Connected wallet address is shown in a truncated, copy-friendly format in the header.

### Balance Management
- **Live XLM Balance** — Fetched directly from the Stellar Horizon testnet API and displayed prominently on the wallet card.
- **Friendbot Funding** — New accounts with zero balance can be funded instantly with 10,000 test XLM via Stellar's Friendbot faucet.
- **Refresh on Demand** — Manually refresh your balance at any time to reflect the latest ledger state.

### Payment Flow
- **Send XLM** — Enter a recipient Stellar address and amount to initiate a payment. The transaction is built with `TransactionBuilder`, signed via Freighter, and submitted to the Stellar testnet.
- **Smart Account Handling** — Automatically uses `createAccount` for unfunded destinations and `payment` for existing accounts.
- **Input Validation** — Real-time validation for Stellar addresses (must start with `G`, 56 characters) and amounts (must be positive numbers).

### Transaction Feedback
- **Success/Failure Status** — Clear visual indicators for transaction outcomes.
- **Transaction Hash** — Displayed with one-click copy-to-clipboard functionality.
- **Stellar Expert Link** — Direct link to view the transaction on Stellar Expert's testnet explorer.
- **Toast Notifications** — Auto-dismissing notifications for wallet events, payments, and errors.

## Screenshots

### Wallet Connected State
![Wallet Connected State](screenshots/Wallet%20connected%20state.png)

### Balance Displayed
![Balance Displayed](screenshots/Balance%20displayed.png)

### Successful Testnet Transaction
![Successful Testnet Transaction](screenshots/Successful%20testnet%20transaction.png)

### Transaction Result Shown to User
![Transaction Result Shown to User](screenshots/The%20transaction%20result%20is%20shown%20to%20the%20user.png)

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework with hooks for state management |
| Vite 6 | Fast build tool and dev server with HMR |
| Tailwind CSS 3 | Utility-first styling with custom dark theme |
| @stellar/stellar-sdk | Stellar network interaction (Horizon API, TransactionBuilder) |
| @stellar/freighter-api | Freighter wallet connection, access, and transaction signing |

## Getting Started (Testnet)

This application runs on the **Stellar Testnet**. No real funds are involved.

### Prerequisites

1. **Node.js** v18 or higher — [Download](https://nodejs.org/)
2. **Freighter Wallet** — Install the [Freighter browser extension](https://www.freighter.app/)
3. Switch Freighter to **Testnet**: Open Freighter → Settings → Network → **Testnet**

### Installation

```bash
# Clone the repository
git clone https://github.com/sahilg28/orbitpay.git
cd orbitpay

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser with Freighter installed.

### Usage Steps

1. **Connect Wallet** — Click "Connect Wallet" in the header and approve the connection in Freighter.
2. **Fund Account** — If your balance is 0, click "Fund with Friendbot" to receive 10,000 test XLM (required for transaction fees).
3. **Send Payment** — Enter a recipient Stellar address (starts with `G`, 56 characters) and an amount in XLM.
4. **Approve Transaction** — Click "Send XLM" and confirm the transaction in the Freighter popup.
5. **View Result** — See the transaction hash, copy it to clipboard, or view it on [Stellar Expert](https://stellar.expert/explorer/testnet).

## Project Structure

```
src/
├── main.jsx                      # App entry point
├── App.jsx                       # Main layout, state management, toast system
├── index.css                     # Tailwind config + custom animations & glass styles
├── lib/
│   └── stellar.js                # Stellar helper class (connect, balance, send, fund)
└── components/
    ├── Icons.jsx                 # Lightweight SVG icon components
    ├── WalletConnect.jsx         # Header wallet button with address display
    ├── WalletCard.jsx            # Balance card with refresh & Friendbot funding
    ├── SendPayment.jsx           # Payment form with real-time validation
    └── TransactionStatus.jsx     # Transaction result with hash & explorer link
```

## Network Configuration

| Resource | URL |
|---|---|
| Horizon API | `https://horizon-testnet.stellar.org` |
| Block Explorer | [Stellar Expert (Testnet)](https://stellar.expert/explorer/testnet) |
| Friendbot Faucet | `https://friendbot.stellar.org` |

## License

MIT
