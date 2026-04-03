# FastGift 

> AI-powered gift agent built on Fast Stack. Tell it who you're gifting, what they love, and your budget it finds the perfect gift on Amazon and orders it autonomously.

---

## What It Does

FastGift is an agentic commerce application. You describe a person and a budget. The AI agent:

1. Generates an intelligent Amazon search query based on the recipient's personality
2. Searches real Amazon products via the Fast Shop API
3. Picks the best match within budget
4. Gets a real price quote including shipping and tax
5. Places the order on Amazon paid autonomously using USDC via Fast Stack

No card. No checkout. No account needed.

---

## Built On

| Layer | Purpose |
|---|---|
| **FastSkill** | Agent wallet creation + Amazon ordering flow |
| **AllSet** | USDC wallet funding |
| **FastSet** | Cryptographic payment settlement (x402) |
| **Fast Shop API** | Real Amazon product search + ordering |
| **Claude AI** | Intelligent gift selection |

---

## Tech Stack

- Node.js + Express (backend)
- Vanilla HTML/CSS/JS (frontend)
- `@fastxyz/sdk` — Fast wallet
- `@fastxyz/x402-client` — x402 payment protocol
- `node-fetch` — API calls
- Claude API (`claude-sonnet-4-20250514`) — AI gift picker

---

## Project Structure

```
fastgift/
├── server.js              # Express backend + Fast Stack integration
├── package.json
├── .env.example           # Environment variable template
├── .gitignore
├── public/
│   └── index.html         # Full frontend (3 screens)
├── screenshots/
│   ├── landing.png
│   ├── form.png
│   ├── agent.png
│   ├── quote.png
│   └── allramp.png
└── README.md
```

---

## How to Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/Aqeelerh/fastgift.git
cd fastgift
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your Fast wallet

- Install the Fast wallet browser extension
- Generate or import your wallet
- Fund it at [allramp.fast.xyz](https://allramp.fast.xyz)

### 4. Set environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
FAST_PRIVATE_KEY=your_fast_wallet_private_key_here
FAST_ADDRESS=your_fast_wallet_address_here
```

### 5. Run the server

```bash
node server.js
```

Open `http://localhost:3000`

---

## How the Payment Works

FastGift uses the **x402 payment protocol**  Fast Stack's cryptographic payment layer.

When a user confirms an order:

1. Backend calls `POST /quote` → gets `quote_id` and `price_usdc`
2. Backend calls `POST /orders` with x402 payment header signed by your wallet's private key
3. Fast Stack verifies signature → deducts USDC → places Amazon order
4. Any unused USDC (excess shipping/tax budget) is automatically refunded

Your wallet is the funding source. One funded wallet powers all orders through the app.

---

## Environment Variables

```
FAST_PRIVATE_KEY=    # Your Fast wallet private key (keep secret, never commit)
FAST_ADDRESS=        # Your Fast wallet address (fast1...)
```

---

## Demo

 [Watch the demo video](https://youtube.com/your-link-here)

🔗 [Live app](https://fastgift-1.onrender.com/)

---

## Author

Built by [@aqeelerh](https://x.com/Aqeelerh)  PiSquared Ambassador

Powered by [Fast Stack](https://shop.fast.xyz) | [PiSquared](https://x.com/pisquared)

---

## License

MIT
