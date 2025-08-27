# CinetPay React Native SDK

[![npm version](https://badge.fury.io/js/@tikayere%2Fnative-cinetpay.svg)](https://badge.fury.io/js/@tikayere%2Fnative-cinetpay)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.60+-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)

React Native/Expo SDK for CinetPay payment integration in West Africa.

## 🚀 Why use this package?

This **React Native compatible** library allows you to:

* ✅ **Accept payments** with all operators available at [CinetPay](https://cinetpay.com)
* ✅ **React Native/Expo Support** - Works natively on mobile
* ✅ **Integrated WebView** - Smooth payment flow within your app
* ✅ **AsyncStorage** - Secure payment data storage
* ✅ **TypeScript** - Full type support
* ✅ **Check payment status** from transaction identifier
* ✅ **Robust error handling** and modern architecture

## 📱 Installation

### Install the main package
```bash
npm install @tikayere/native-cinetpay
```

### Install required dependencies
```bash
npm install @react-native-async-storage/async-storage react-native-webview
```

### iOS - Pod Install
```bash
cd ios && pod install
```

## 🛠️ Configuration

### Configuration Properties

| Props        | Type           | Description  |
| :------------- |:-------------| :-----|
| `apikey`      | string | Your CinetPay service API key - **Required** |
| `site_id`      | number | Your CinetPay site ID - **Required**  |
| `notify_url`      | string | IPN notification URL - **Required**  |
| `return_url`      | string | Return URL after payment - **Required**  |
| `lang`      | 'fr' \| 'en' | Payment gateway language - **Required** |

### Payment Properties

| Props        | Type           | Description  |
| :------------- |:-------------| :-----|
| `transaction_id`      | string | Unique transaction identifier - **Required** |
| `amount`      | number | Payment amount - **Required**  |
| `currency`      | 'XOF' \| 'XAF' \| 'CDF' \| 'GNF' | Currency - **Required**  |
| `description`      | string | Payment description - **Required** |
| `channels`      | 'ALL' \| 'MOBILE_MONEY' \| 'CREDIT_CARD' | Payment methods - **Required** |
| `customer_email`      | string | Customer email - *Optional* |
| `customer_phone_number`      | string | Customer phone - *Optional* |
| `customer_name`      | string | Customer first name - *Optional* |
| `customer_surname`      | string | Customer last name - *Optional* |

## 💻 Usage

### 1. Library Initialization

```typescript
import { Cinetpay } from '@tikayere/native-cinetpay';

const cinetpay = new Cinetpay({
  apikey: 'your-api-key',
  site_id: 123456,
  notify_url: 'https://your-site.com/notify',
  return_url: 'https://your-site.com/return',
  lang: 'en',
});
```

### 2. Payment Interface with WebView

```typescript
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { 
  Cinetpay, 
  CinetPayWebView, 
  generateTransactionId,
  PaymentConfigOptions 
} from '@tikayere/native-cinetpay';

const PaymentScreen = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const cinetpay = new Cinetpay({
    apikey: 'your-api-key',
    site_id: 123456,
    notify_url: 'https://your-site.com/notify',
    return_url: 'https://your-site.com/return',
    lang: 'en',
  });

  const handlePayment = async () => {
    try {
      const paymentConfig: PaymentConfigOptions = {
        transaction_id: generateTransactionId(),
        amount: 1000,
        currency: 'XOF',
        channels: 'ALL',
        description: 'React Native test payment',
        customer_email: 'customer@example.com',
      };

      const response = await cinetpay.makePayment(paymentConfig);
      
      if (response.code === '201' && response.data?.payment_url) {
        setPaymentUrl(response.data.payment_url);
        setShowWebView(true);
      } else {
        Alert.alert('Error', response.message || 'Payment initialization failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Payment error');
    }
  };

  if (showWebView && paymentUrl) {
    return (
      <CinetPayWebView
        paymentUrl={paymentUrl}
        returnUrl="https://your-site.com/return"
        onPaymentSuccess={(data) => {
          Alert.alert('Success', 'Payment completed successfully!');
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
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Pay with CinetPay" onPress={handlePayment} />
    </View>
  );
};
```

### 3. Payment Status Verification

```typescript
const checkPaymentStatus = async (transactionId: string) => {
  try {
    const statusResponse = await cinetpay.checkPayStatus(transactionId);
    
    if (statusResponse.code === '00') {
      console.log('Payment successful:', statusResponse.data);
    } else {
      console.log('Payment pending:', statusResponse.message);
    }
  } catch (error) {
    console.error('Status check error:', error);
  }
};
```

### 4. Stored Data Management

```typescript
// Retrieve stored payment data
const storedPayment = await cinetpay.getStoredPaymentData();

// Retrieve stored payment status
const storedStatus = await cinetpay.getStoredPaymentStatus(transactionId);

// Clear all stored data
await cinetpay.clearStoredPaymentData();
```

## 🔧 Utilities

### Transaction ID Generation

```typescript
import { generateTransactionId } from '@tikayere/native-cinetpay';

const transactionId = generateTransactionId();
// Format: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### Data Validation

```typescript
import { isValidEmail, isValidPhoneNumber } from '@tikayere/native-cinetpay';

const emailValid = isValidEmail('customer@example.com');
const phoneValid = isValidPhoneNumber('+22501234567');
```

## 📖 Complete Example

See the [USAGE_REACT_NATIVE.md](USAGE_REACT_NATIVE.md) file for a complete integration example.

## 🌍 Compatibility

### Supported Platforms
- ✅ **React Native** 0.60+
- ✅ **Expo** (SDK 41+)
- ✅ **Android** API 21+
- ✅ **iOS** 11.0+

### Supported Currencies
- **XOF** - CFA Franc (West Africa)
- **XAF** - CFA Franc (Central Africa)
- **CDF** - Congolese Franc
- **GNF** - Guinean Franc

## 🔗 Notification URL

To receive payment notifications, configure your `notify_url` to handle CinetPay webhooks on the server side.

More information: [CinetPay Documentation](https://github.com/cinetpay/seamlessIntegration#etape-1--pr%C3%A9parer-la-page-de-notification)

## 🆘 Troubleshooting

### Common Errors

1. **Module not found** - Make sure you have installed all dependencies
2. **WebView not working** - Check that `react-native-webview` is properly linked
3. **AsyncStorage** - Check that `@react-native-async-storage/async-storage` is installed

### Support

- 📧 Issues: [GitHub Issues](https://github.com/tikayere/native-cinetpay/issues)
- 📚 Complete documentation: [USAGE_REACT_NATIVE.md](USAGE_REACT_NATIVE.md)

## 📄 French Version

Version française disponible [ici](README.md)

---

## 🎉 Happy Coding!

Developed with ❤️ for the African React Native community.