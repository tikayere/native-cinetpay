# React Native Usage Guide

This guide shows how to integrate the CinetPay library in React Native applications.

## Installation

```bash
npm install @azinakou/cinetpay

# Install required peer dependencies
npm install @react-native-async-storage/async-storage react-native-webview

# For iOS, run pod install
cd ios && pod install
```

## Setup

The library requires proper linking of native dependencies:

### For React Native 0.60+
Auto-linking should handle the dependencies automatically. Make sure to run `pod install` for iOS.

### For older React Native versions
Follow the manual linking instructions for:
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)
- [react-native-webview](https://github.com/react-native-webview/react-native-webview)

## Basic Usage

### 1. Initialize CinetPay

```typescript
import { Cinetpay, generateTransactionId } from '@azinakou/cinetpay';

const cinetpay = new Cinetpay({
  apikey: 'your-api-key',
  site_id: 123456,
  notify_url: 'https://yoursite.com/notify',
  return_url: 'https://yoursite.com/return',
  lang: 'fr', // or 'en'
});
```

### 2. Initialize Payment

```typescript
import { PaymentConfigOptions } from '@azinakou/cinetpay';

const handlePayment = async () => {
  try {
    const paymentConfig: PaymentConfigOptions = {
      transaction_id: generateTransactionId(),
      amount: 1000,
      currency: 'XOF',
      channels: 'ALL',
      description: 'Payment for order #123',
      customer_email: 'customer@example.com',
      customer_phone_number: '+22512345678',
    };

    const response = await cinetpay.makePayment(paymentConfig);
    
    if (response.code === '201' && response.data?.payment_url) {
      // Payment initialization successful
      setPaymentUrl(response.data.payment_url);
      setShowWebView(true);
    } else {
      console.error('Payment initialization failed:', response.message);
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

### 3. Handle Payment with WebView

```typescript
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { CinetPayWebView } from '@azinakou/cinetpay';

const PaymentScreen = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const handlePaymentSuccess = (data) => {
    Alert.alert('Success', 'Payment completed successfully!');
    setShowWebView(false);
    // Handle successful payment
    console.log('Payment data:', data);
  };

  const handlePaymentError = (error) => {
    Alert.alert('Error', `Payment failed: ${error}`);
    setShowWebView(false);
  };

  const handlePaymentCancel = () => {
    Alert.alert('Cancelled', 'Payment was cancelled');
    setShowWebView(false);
  };

  if (showWebView && paymentUrl) {
    return (
      <CinetPayWebView
        paymentUrl={paymentUrl}
        returnUrl="https://yoursite.com/return"
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        onPaymentCancel={handlePaymentCancel}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Pay with CinetPay" onPress={handlePayment} />
    </View>
  );
};
```

### 4. Check Payment Status

```typescript
const checkPaymentStatus = async (transactionId: string) => {
  try {
    const statusResponse = await cinetpay.checkPayStatus(transactionId);
    
    if (statusResponse.code === '00') {
      console.log('Payment status:', statusResponse.data);
      // Payment successful
    } else {
      console.log('Payment not completed:', statusResponse.message);
    }
  } catch (error) {
    console.error('Status check error:', error);
  }
};
```

### 5. Using Stored Payment Data

```typescript
// Get stored payment data
const storedPayment = await cinetpay.getStoredPaymentData();

// Get stored payment status
const storedStatus = await cinetpay.getStoredPaymentStatus(transactionId);

// Clear all stored data
await cinetpay.clearStoredPaymentData();
```

## Complete Example

```typescript
import React, { useState } from 'react';
import {
  View,
  Button,
  Alert,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import {
  Cinetpay,
  CinetPayWebView,
  generateTransactionId,
  PaymentConfigOptions,
} from '@azinakou/cinetpay';

const App = () => {
  const [amount, setAmount] = useState('1000');
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const cinetpay = new Cinetpay({
    apikey: 'your-api-key',
    site_id: 123456,
    notify_url: 'https://yoursite.com/notify',
    return_url: 'https://yoursite.com/return',
    lang: 'fr',
  });

  const handlePayment = async () => {
    try {
      const paymentConfig: PaymentConfigOptions = {
        transaction_id: generateTransactionId(),
        amount: parseInt(amount),
        currency: 'XOF',
        channels: 'ALL',
        description: 'Test payment from React Native',
        customer_email: 'test@example.com',
      };

      const response = await cinetpay.makePayment(paymentConfig);
      
      if (response.code === '201' && response.data?.payment_url) {
        setPaymentUrl(response.data.payment_url);
        setShowWebView(true);
      } else {
        Alert.alert('Error', response.message || 'Payment initialization failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Payment failed');
    }
  };

  if (showWebView && paymentUrl) {
    return (
      <CinetPayWebView
        paymentUrl={paymentUrl}
        returnUrl="https://yoursite.com/return"
        onPaymentSuccess={(data) => {
          Alert.alert('Success', 'Payment completed!');
          setShowWebView(false);
        }}
        onPaymentError={(error) => {
          Alert.alert('Error', error);
          setShowWebView(false);
        }}
        onPaymentCancel={() => {
          Alert.alert('Cancelled', 'Payment cancelled');
          setShowWebView(false);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CinetPay React Native Demo</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Amount (XOF)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      
      <Button title="Pay with CinetPay" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default App;
```

## Important Notes

- Always test with CinetPay sandbox credentials first
- Handle network errors gracefully in production
- Store sensitive configuration (API keys) securely
- The WebView component handles the payment flow automatically
- Payment data is automatically stored using AsyncStorage
- Use the provided utility functions for validation and ID generation

## Troubleshooting

### Metro bundler issues
If you encounter Metro bundler issues with the new dependencies, make sure your `metro.config.js` is up to date.

### iOS build issues
Make sure to run `pod install` after installing the peer dependencies.

### Android permissions
No additional permissions are required for this library as it only uses standard React Native APIs.