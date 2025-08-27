# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Package**: @tikayere/native-cinetpay
**Repository**: https://github.com/tikayere/native-cinetpay
**Author**: tikayere

## Project Overview
This is a React Native compatible TypeScript npm package that provides integration with CinetPay, a West African payment gateway. The library enables mobile money and credit card payments for React Native/Expo applications, supporting currencies like XOF, XAF, CDF, and GNF.

**Key Features:**
- React Native compatible (uses AsyncStorage instead of localStorage)
- WebView-based payment flow using react-native-webview
- TypeScript support with proper type definitions
- AsyncStorage for payment data persistence
- No Node.js dependencies (querystring replaced with custom implementation)

## Key Commands

### Development
- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm test` - Run Jest tests with configuration from jestconfig.json
- `npm run lint` - Run ESLint with auto-fix on src/**/*.ts files
- `npm run format` - Format code with Prettier

### Pre-publish Pipeline
- `npm run prepare` - Runs build automatically on npm install
- `npm run prepublishOnly` - Runs tests and linting before publishing
- `npm run preversion` - Runs linting before version bump
- `npm run postversion` - Pushes changes and tags to git

### Testing Individual Components
- To test a specific file: `npx jest src/__tests__/filename.test.ts`
- To run tests in watch mode: `npx jest --watch`

## Architecture

### Core Structure
- **Entry Point**: `src/index.ts` - Exports all public APIs
- **Main Class**: `src/cinetpay.ts` - Contains the `Cinetpay` class with payment operations
- **Models**: `src/models/` - Type definitions and configuration classes
  - `cinetpayConfig.ts` - Service configuration (API keys, URLs, language)
  - `paymentConfig.ts` - Payment transaction configuration
- **Components**: `src/components/` - React Native components
  - `CinetPayWebView.tsx` - WebView component for payment flow
- **Utils**: `src/utils/` - Utility functions and storage
  - `storage.ts` - AsyncStorage wrapper for payment data
  - `index.ts` - Utility functions (ID generation, validation)

### Key Classes & Components
- `Cinetpay` - Main service class with methods:
  - `makePayment(paymentConfig)` - Initiates payment and returns payment URL
  - `checkPayStatus(transaction_id)` - Checks payment status by transaction ID or token
  - `getStoredPaymentData()` - Retrieves payment data from AsyncStorage
  - `clearStoredPaymentData()` - Clears stored payment data
- `CinetPayWebView` - React Native component for handling payment flow
- `PaymentStorage` - AsyncStorage utility for payment data persistence

### React Native Payment Flow
1. Initialize `Cinetpay` class with service configuration
2. Create `PaymentConfigOptions` with transaction details
3. Call `makePayment()` to get payment URL and store data in AsyncStorage
4. Use `CinetPayWebView` component to handle payment in WebView
5. WebView monitors URL changes for completion/cancellation
6. Use `checkPayStatus()` to verify final payment status

### Dependencies
- Uses `AsyncStorage` for data persistence (replaces localStorage)
- Uses `react-native-webview` for payment flow (replaces window.location)
- Uses `axios` for HTTP requests
- Custom `stringify` function replaces Node.js `querystring`

### HTTP Client
- Uses Axios for API calls to `https://api-checkout.cinetpay.com/v2/`
- Uses custom `stringify` function for form-encoded request bodies (React Native compatible)
- 10-second timeout on requests (increased for mobile networks)

## Important Notes
- This is a React Native compatible payment gateway integration
- Handle API keys securely - store in secure storage, not in plain text
- Payment data is automatically stored in AsyncStorage with prefixed keys
- All API responses are stored locally for offline access
- Tests are located in `src/__tests__/` and use Jest with ts-jest
- Requires `@react-native-async-storage/async-storage` and `react-native-webview` as peer dependencies
- See `USAGE_REACT_NATIVE.md` for detailed React Native implementation examples