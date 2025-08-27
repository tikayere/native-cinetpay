# CinetPay React Native SDK

[![npm version](https://badge.fury.io/js/@tikayere%2Fnative-cinetpay.svg)](https://badge.fury.io/js/@tikayere%2Fnative-cinetpay)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.60+-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)

SDK React Native/Expo pour l'intégration des paiements CinetPay en Afrique de l'Ouest.

## 🚀 Pourquoi utiliser ce package ?

Cette bibliothèque **React Native compatible** vous permet de :

* ✅ **Accepter des paiements** avec tous les opérateurs disponibles chez [CinetPay](https://cinetpay.com)
* ✅ **Support React Native/Expo** - Fonctionne nativement sur mobile
* ✅ **WebView intégré** - Flux de paiement fluide dans votre application
* ✅ **AsyncStorage** - Stockage sécurisé des données de paiement
* ✅ **TypeScript** - Support complet des types
* ✅ **Vérifier le statut des paiements** à partir de l'identifiant de transaction
* ✅ **Gestion d'erreurs** robuste et moderne

## 📱 Installation

### Installer le package principal
```bash
npm install @tikayere/native-cinetpay
```

### Installer les dépendances requises
```bash
npm install @react-native-async-storage/async-storage react-native-webview
```

### iOS - Pod Install
```bash
cd ios && pod install
```

## 🛠️ Configuration

### Propriétés de Configuration

| Props        | Type           | Description  |
| :------------- |:-------------| :-----|
| `apikey`      | string | Clé API de votre service CinetPay - **Obligatoire** |
| `site_id`      | number | ID de votre site CinetPay - **Obligatoire**  |
| `notify_url`      | string | URL de notification IPN - **Obligatoire**  |
| `return_url`      | string | URL de retour après paiement - **Obligatoire**  |
| `lang`      | 'fr' \| 'en' | Langue du guichet de paiement - **Obligatoire** |

### Propriétés de Paiement

| Props        | Type           | Description  |
| :------------- |:-------------| :-----|
| `transaction_id`      | string | Identifiant unique de transaction - **Obligatoire** |
| `amount`      | number | Montant du paiement - **Obligatoire**  |
| `currency`      | 'XOF' \| 'XAF' \| 'CDF' \| 'GNF' | Devise - **Obligatoire**  |
| `description`      | string | Description du paiement - **Obligatoire** |
| `channels`      | 'ALL' \| 'MOBILE_MONEY' \| 'CREDIT_CARD' | Moyens de paiement - **Obligatoire** |
| `customer_email`      | string | Email du client - *Facultatif* |
| `customer_phone_number`      | string | Téléphone du client - *Facultatif* |
| `customer_name`      | string | Prénom du client - *Facultatif* |
| `customer_surname`      | string | Nom du client - *Facultatif* |

## 💻 Utilisation

### 1. Initialisation de la librairie

```typescript
import { Cinetpay } from '@tikayere/native-cinetpay';

const cinetpay = new Cinetpay({
  apikey: 'votre-cle-api',
  site_id: 123456,
  notify_url: 'https://votre-site.com/notify',
  return_url: 'https://votre-site.com/return',
  lang: 'fr',
});
```

### 2. Interface de Paiement avec WebView

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
    apikey: 'votre-cle-api',
    site_id: 123456,
    notify_url: 'https://votre-site.com/notify',
    return_url: 'https://votre-site.com/return',
    lang: 'fr',
  });

  const handlePayment = async () => {
    try {
      const paymentConfig: PaymentConfigOptions = {
        transaction_id: generateTransactionId(),
        amount: 1000,
        currency: 'XOF',
        channels: 'ALL',
        description: 'Paiement test React Native',
        customer_email: 'client@example.com',
      };

      const response = await cinetpay.makePayment(paymentConfig);
      
      if (response.code === '201' && response.data?.payment_url) {
        setPaymentUrl(response.data.payment_url);
        setShowWebView(true);
      } else {
        Alert.alert('Erreur', response.message || 'Échec de l\'initialisation du paiement');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Erreur de paiement');
    }
  };

  if (showWebView && paymentUrl) {
    return (
      <CinetPayWebView
        paymentUrl={paymentUrl}
        returnUrl="https://votre-site.com/return"
        onPaymentSuccess={(data) => {
          Alert.alert('Succès', 'Paiement effectué avec succès !');
          setShowWebView(false);
        }}
        onPaymentError={(error) => {
          Alert.alert('Erreur', error);
          setShowWebView(false);
        }}
        onPaymentCancel={() => {
          Alert.alert('Annulé', 'Paiement annulé');
          setShowWebView(false);
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Payer avec CinetPay" onPress={handlePayment} />
    </View>
  );
};
```

### 3. Vérification du statut de paiement

```typescript
const checkPaymentStatus = async (transactionId: string) => {
  try {
    const statusResponse = await cinetpay.checkPayStatus(transactionId);
    
    if (statusResponse.code === '00') {
      console.log('Paiement réussi :', statusResponse.data);
    } else {
      console.log('Paiement en attente :', statusResponse.message);
    }
  } catch (error) {
    console.error('Erreur de vérification :', error);
  }
};
```

### 4. Gestion des données stockées

```typescript
// Récupérer les données de paiement stockées
const storedPayment = await cinetpay.getStoredPaymentData();

// Récupérer le statut d'un paiement stocké
const storedStatus = await cinetpay.getStoredPaymentStatus(transactionId);

// Effacer toutes les données stockées
await cinetpay.clearStoredPaymentData();
```

## 🔧 Utilitaires

### Génération d'identifiants de transaction

```typescript
import { generateTransactionId } from '@tikayere/native-cinetpay';

const transactionId = generateTransactionId();
// Format: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### Validation des données

```typescript
import { isValidEmail, isValidPhoneNumber } from '@tikayere/native-cinetpay';

const emailValid = isValidEmail('client@example.com');
const phoneValid = isValidPhoneNumber('+22501234567');
```

## 📖 Exemple complet

Voir le fichier [USAGE_REACT_NATIVE.md](USAGE_REACT_NATIVE.md) pour un exemple complet d'intégration.

## 🌍 Compatibilité

### Plateformes supportées
- ✅ **React Native** 0.60+
- ✅ **Expo** (SDK 41+)
- ✅ **Android** API 21+
- ✅ **iOS** 11.0+

### Devises supportées
- **XOF** - Franc CFA (Afrique de l'Ouest)
- **XAF** - Franc CFA (Afrique Centrale)
- **CDF** - Franc Congolais
- **GNF** - Franc Guinéen

## 🔗 URL de Notification

Pour recevoir les notifications de paiement, configurez votre `notify_url` pour traiter les webhooks CinetPay côté serveur. 

Plus d'informations : [Documentation CinetPay](https://github.com/cinetpay/seamlessIntegration#etape-1--pr%C3%A9parer-la-page-de-notification)

## 🆘 Dépannage

### Erreurs courantes

1. **Module non trouvé** - Assurez-vous d'avoir installé toutes les dépendances
2. **WebView ne fonctionne pas** - Vérifiez que `react-native-webview` est correctement lié
3. **AsyncStorage** - Vérifiez que `@react-native-async-storage/async-storage` est installé

### Support

- 📧 Issues: [GitHub Issues](https://github.com/tikayere/native-cinetpay/issues)
- 📚 Documentation complète: [USAGE_REACT_NATIVE.md](USAGE_REACT_NATIVE.md)

## 📄 Version Anglaise

English version available [here](README-EN.md)

---

## 🎉 Bon développement !

Développé avec ❤️ pour la communauté React Native africaine.