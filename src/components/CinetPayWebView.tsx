import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { PaymentStorage } from '../utils/storage';

export interface CinetPayWebViewProps {
  /**
   * Payment URL from CinetPay payment initialization
   */
  paymentUrl: string;
  
  /**
   * Callback when payment is completed successfully
   */
  onPaymentSuccess?: (data: any) => void;
  
  /**
   * Callback when payment fails or is cancelled
   */
  onPaymentError?: (error: string) => void;
  
  /**
   * Callback when payment is cancelled by user
   */
  onPaymentCancel?: () => void;
  
  /**
   * Return URL that indicates successful payment
   */
  returnUrl: string;
  
  /**
   * Custom styles for the WebView container
   */
  style?: any;
  
  /**
   * Show loading indicator
   */
  showLoading?: boolean;
}

/**
 * React Native WebView component for CinetPay payment flow
 */
export const CinetPayWebView: React.FC<CinetPayWebViewProps> = ({
  paymentUrl,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  returnUrl,
  style,
  showLoading = true,
}) => {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (!paymentUrl) {
      onPaymentError?.('Payment URL is required');
    }
  }, [paymentUrl, onPaymentError]);

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url, loading } = navState;

    // Check if user has returned to the return URL (success)
    if (url.startsWith(returnUrl)) {
      try {
        // Extract any query parameters that might contain payment info
        const urlParams = new URLSearchParams(url.split('?')[1] || '');
        const paymentData = Object.fromEntries(urlParams.entries());
        
        // Store the payment completion data
        await PaymentStorage.storePaymentData({
          ...paymentData,
          completedAt: new Date().toISOString(),
          status: 'completed'
        });
        
        onPaymentSuccess?.(paymentData);
      } catch (error) {
        console.warn('Error processing payment success:', error);
        onPaymentSuccess?.({});
      }
      return;
    }

    // Check for cancellation or error indicators in URL
    if (url.includes('cancel') || url.includes('error')) {
      onPaymentCancel?.();
      return;
    }

    // Check if we're still on CinetPay domain
    if (!url.includes('cinetpay.com') && !url.startsWith(returnUrl)) {
      // Might be an error redirect
      onPaymentError?.('Payment was redirected to an unexpected URL');
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error:', nativeEvent);
    onPaymentError?.(`WebView error: ${nativeEvent.description || 'Unknown error'}`);
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView HTTP error:', nativeEvent);
    onPaymentError?.(`HTTP error: ${nativeEvent.statusCode} - ${nativeEvent.description}`);
  };

  if (!paymentUrl) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        onHttpError={handleHttpError}
        startInLoadingState={showLoading}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default CinetPayWebView;