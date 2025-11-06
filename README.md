# Token Price Explorer

A modern, responsive single-page application for exploring token prices and conversions using React, TypeScript, and Vite.

## Screenshot

![Token Price Explorer](./screenshot.png)
*Add your screenshot here - replace `screenshot.png` with your actual screenshot file*

## Features

- **Token Selection**: Choose from USDC, WBTC, USDT, and ETH tokens
- **Real-time Price Conversion**: Convert between tokens using live price data from FunKit API
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error handling with retry options
- **Loading States**: Visual feedback during data fetching
- **Persistent State**: Selected tokens and amounts are saved in local storage

## Tech Stack

- **React 19** - UI framework (conscious choice for latest features; tested against 19.1.x)
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query v5** - Server state management with intelligent caching, automatic refetching, and optimistic updates
- **Zustand** - Client state management
- **Tailwind CSS v3** - Utility-first styling
- **@funkit/api-base** - Token and price data API

## Notable Design Choices

### 🎨 Jupiter-Inspired Dark Theme
The application features a dark color palette inspired by Jupiter Exchange, with semantic color naming (`bg-primary`, `text-secondary`, etc.) for consistency and maintainability.

### 🎯 Modal-Based Token Selection
Token selection uses a full-screen modal with:
- **Search functionality** - Filter tokens by symbol or name
- **Popular tokens grid** - Quick access to frequently used tokens
- **Multi-chain support** - Visual chain indicators with color coding

### 🧩 Component Architecture
- **Atomic design principles** - Small, reusable components (`TokenIcon`, `Loader`, `ErrorBanner`)
- **Feature-based organization** - Swap logic isolated in `features/swap/` with dedicated hooks, store, and business logic
- **Separation of concerns** - UI components separate from state management and API calls

### ⚡ Performance Optimizations
- **Debounced inputs** - 300ms delay on amount changes to reduce API calls
- **Memoized calculations** - `useMemo` for expensive computations and filtered lists
- **Persistent state** - Zustand middleware saves user preferences to localStorage
- **Lazy error handling** - Dismissible error banners with retry functionality
- **TanStack Query caching** - Intelligent cache management with 30s staleTime for prices, 1hr for token metadata
- **Background refetching** - Automatic price updates every 30 seconds and on window focus
- **Placeholder data** - Previous data shown during refetch to eliminate loading flashes

## Product Research & Industry Patterns

This application incorporates proven UX patterns from leading DEX aggregators and crypto exchanges:

### 1. **Modal-Based Token Selection** (Inspired by Jupiter Exchange & Matcha)
- **Full-screen modal** with search and popular tokens grid
- **Multi-chain visual indicators** with color-coded badges
- **Fuzzy search** for quick token discovery
- **Why**: Reduces cognitive load by focusing user attention on one task at a time, while providing quick access to frequently used tokens

### 2. **Swap Interface Layout** (Inspired by Coinbase & Uniswap)
- **Vertical card layout** with clear "Selling" and "Buying" sections
- **Swap direction button** positioned between input cards
- **Real-time USD value display** for both source and target amounts
- **Why**: Familiar pattern that users recognize instantly, reducing learning curve and increasing confidence in transactions

### 3. **Smart Data Fetching** (Inspired by Matcha & 1inch)
- **Automatic price updates** with visual freshness indicators
- **Optimistic UI updates** using TanStack Query's placeholder data
- **Graceful error handling** with retry mechanisms
- **Why**: Ensures users always see current prices without jarring loading states, critical for price-sensitive swap decisions

### 4. **Quick Amount Buttons** (Inspired by Coinbase & Jupiter)
- **Preset USD amounts** ($100, $500, $1000) for rapid input
- **One-click selection** to reduce friction
- **Why**: Speeds up common workflows and reduces input errors

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your FunKit API key:
   ```
   VITE_FUNKIT_API_KEY=your_api_key_here
   ```

## Running the Application

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Supported Tokens

| Symbol | Chain ID | Network  |
| ------ | -------- | -------- |
| USDC   | 1        | Ethereum |
| WBTC   | 1        | Ethereum |
| USDT   | 137      | Polygon  |
| ETH    | 8453     | Base     |

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── TokenSelector.tsx
│   ├── AmountInput.tsx
│   ├── ConversionResult.tsx
│   ├── Loader.tsx
│   └── ErrorBanner.tsx
├── features/swap/        # Swap feature module
│   ├── SwapPage.tsx      # Main page component
│   ├── hooks/            # Custom React hooks (TanStack Query)
│   │   ├── useTokenInfo.ts    # Token metadata with 1hr cache
│   │   ├── usePriceInfo.ts    # Price data with 30s cache + auto-refetch
│   │   └── useDebouncedValue.ts
│   ├── logic/            # Business logic
│   │   └── convert.ts
│   └── store/            # State management
│       └── swapStore.ts
├── providers/            # React context providers
│   └── QueryProvider.tsx # TanStack Query configuration
├── services/             # API services
│   └── funkit.ts         # FunKit API wrapper
├── types/                # TypeScript types
│   └── api.ts
└── styles/               # CSS stylesheets
    ├── globals.css
    ├── swap-page.css
    ├── token-selector.css
    ├── amount-input.css
    ├── conversion-result.css
    ├── error-banner.css
    └── loader.css
```

## API Integration

The application uses the FunKit API to fetch:

- **Token Information**: Contract addresses, decimals, and metadata
- **Price Information**: Current USD prices for tokens

### API Functions Used

- `getAssetErc20ByChainAndSymbol()` - Fetch token details
- `getAssetPriceInfo()` - Fetch token prices

## Features in Detail

### Token Selection
- Click on token buttons to select source and target tokens
- Active token is highlighted with a blue background
- Supports 4 major tokens across different chains

### Amount Input
- Enter USD amounts to convert
- Input is validated for positive numbers
- Debounced to reduce API calls (300ms delay)
- Shows error messages for invalid input

### Conversion Display
- Shows token amounts with appropriate decimal formatting
- Displays current token prices
- Shows USD equivalent values
- Animated arrow between source and target

### Error Handling
- Network errors are caught and displayed
- Retry buttons allow users to refetch data
- Dismiss buttons to clear error messages
- Graceful fallbacks when data is unavailable

### Loading States
- Spinner shown while fetching token/price data
- Loading indicators on token boxes
- Disabled input during loading

## Performance Optimizations

### Data Fetching & Caching (TanStack Query v5)
- **Intelligent cache management** - Token metadata cached for 1 hour, prices for 30 seconds
- **Automatic background refetching** - Prices update every 30 seconds and on window focus
- **Placeholder data strategy** - Previous data shown during refetch to eliminate loading flashes
- **Deduplication** - Multiple components requesting same data share a single network request
- **Retry with exponential backoff** - Failed requests retry up to 2 times with smart delays

### UI & State Management
- **Debounced USD input** - 300ms delay to reduce API calls during typing
- **Memoized calculations** - `useMemo` prevents unnecessary re-renders
- **Persistent state** - Zustand middleware saves user preferences to localStorage
- **Optimistic updates** - UI responds instantly while data fetches in background
