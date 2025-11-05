# Token Price Explorer

A modern, responsive single-page application for exploring token prices and conversions using React, TypeScript, and Vite.

## Features

- **Token Selection**: Choose from USDC, WBTC, USDT, and ETH tokens
- **Real-time Price Conversion**: Convert between tokens using live price data from FunKit API
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error handling with retry options
- **Loading States**: Visual feedback during data fetching
- **Persistent State**: Selected tokens and amounts are saved in local storage

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **@funkit/api-base** - Token and price data API

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

| Symbol | Chain ID | Network |
| ------ | -------- | ------- |
| USDC   | 1        | Ethereum |
| WBTC   | 1        | Ethereum |
| USDT   | 137      | Polygon |
| ETH    | 8453     | Base    |

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
│   ├── hooks/            # Custom React hooks
│   │   ├── useTokenInfo.ts
│   │   ├── usePriceInfo.ts
│   │   └── useDebouncedValue.ts
│   ├── logic/            # Business logic
│   │   └── convert.ts
│   └── store/            # State management
│       └── swapStore.ts
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

## Styling

The application uses a modern, gradient-based design with:

- **Color Scheme**: Blue primary color with gray accents
- **Responsive Layout**: Mobile-first approach
- **Animations**: Smooth transitions and loading spinners
- **Accessibility**: Clear visual hierarchy and readable fonts

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Debounced USD input to reduce API calls
- Memoized calculations to prevent unnecessary re-renders
- Lazy loading of token data
- Efficient state management with Zustand

## Troubleshooting

### API Key Issues
- Ensure `VITE_FUNKIT_API_KEY` is set in `.env`
- Check that the API key is valid and has appropriate permissions

### Token Not Found
- Verify the token symbol is correct
- Check that the chain ID is supported
- Try refreshing the page

### Price Data Not Loading
- Check your internet connection
- Verify the API is accessible
- Try clicking the retry button on error messages
