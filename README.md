# OrbitPay — Stellar Testnet Payment dApp

A modern Stellar testnet payment dApp built with React, Vite, and TailwindCSS. Connect your Freighter wallet, view your XLM balance, and send testnet payments with real-time feedback.

![Stellar Testnet](https://img.shields.io/badge/Network-Testnet-yellow)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)

## Features

- **Freighter Wallet Integration** — Connect and disconnect with one click
- **Balance Display** — Live XLM balance fetched from Stellar Horizon testnet
- **Friendbot Funding** — One-click testnet account funding when balance is zero
- **Send XLM** — Transfer XLM to any valid Stellar testnet address
- **Transaction Feedback** — Success/failure status with transaction hash, copy-to-clipboard, and Stellar Expert link
- **Input Validation** — Real-time form validation with clear error messages
- **Toast Notifications** — Auto-dismissing success, error, and info toasts
- **Responsive UI** — Clean dark theme with glassmorphism, gradients, and animations

## Screenshots

### Wallet Connected & Balance Displayed
*(Add screenshot here)*

### Successful Transaction
*(Add screenshot here)*

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 6 | Build tool & dev server |
| TailwindCSS 3 | Utility-first styling |
| @stellar/stellar-sdk | Stellar network interaction |
| @stellar/freighter-api | Freighter wallet connection & signing |

## Prerequisites

1. **Node.js** v18 or higher
2. **Freighter Wallet** — Install the [Freighter browser extension](https://www.freighter.app/)
3. Switch Freighter to **Testnet**: Open Freighter → Settings → Network → **Testnet**

## Setup & Run

```bash
# Clone the repo
git clone https://github.com/sahilg28/orbitpay.git
cd orbitpay

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser with Freighter installed.

## How to Use

1. Click **Connect Wallet** — approve the connection in Freighter
2. If your balance is 0, click **Fund with Friendbot** to receive 10,000 test XLM
3. Enter a recipient Stellar address (starts with `G`, 56 characters) and an amount
4. Click **Send XLM** → approve the transaction in Freighter
5. See the transaction hash, copy it, or view it on Stellar Expert

## Project Structure

```
src/
├── main.jsx                      # App entry point
├── App.jsx                       # Main layout, state, toast system
├── index.css                     # Tailwind + custom animations & glass styles
├── lib/
│   └── stellar.js                # Stellar helper (connect, balance, send, fund)
└── components/
    ├── Icons.jsx                 # Lightweight SVG icon components
    ├── WalletConnect.jsx         # Header wallet button + address display
    ├── WalletCard.jsx            # Balance card with refresh & Friendbot
    ├── SendPayment.jsx           # Payment form with validation
    └── TransactionStatus.jsx     # Transaction result with hash & explorer link
```

## Network

This app runs on **Stellar Testnet** only. No real funds are involved.

- Horizon API: `https://horizon-testnet.stellar.org`
- Explorer: [Stellar Expert (Testnet)](https://stellar.expert/explorer/testnet)
- Friendbot: `https://friendbot.stellar.org`

## License

MIT
