import axios, { AxiosResponse } from 'axios';
import { CinetPayConfig, CinetPayConfigOptions, PaymentConfig, PaymentConfigOptions } from './models';
import { PaymentStorage } from './utils/storage';

const baseUrl = 'https://api-checkout.cinetpay.com/v2/';

// React Native compatible URLSearchParams polyfill
const stringify = (obj: Record<string, any>): string => {
  return Object.entries(obj)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
};

// TypeScript interfaces for API responses
export interface PaymentResponse {
  code: string;
  message: string;
  data?: {
    payment_url: string;
    payment_token: string;
  };
  description?: string;
}

export interface PaymentStatusResponse {
  code: string;
  message: string;
  data?: {
    cpm_site_id: string;
    signature: string;
    cpm_amount: string;
    cpm_trans_id: string;
    cpm_custom: string;
    cpm_currency: string;
    cpm_payid: string;
    cpm_payment_date: string;
    cpm_payment_time: string;
    cpm_error_message: string;
    payment_method: string;
    cpm_phone_prefixe: string;
    cel_phone_num: string;
    cpm_ipn_ack: string;
    created_at: string;
    updated_at: string;
    cpm_result: string;
    cpm_trans_status: string;
    cpm_designation: string;
    buyer_name: string;
  };
  api_response_id: string;
}

export class Cinetpay {
  private config: CinetPayConfig;

  /**
   * Initialize the CinetPay library
   *
   * @param config CinetPay service configuration
   */
  constructor(config: CinetPayConfigOptions) {
    this.config = new CinetPayConfig(config);
  }

  /**
   * Initialize payment process
   *
   * @param paymentConfig Payment configuration details
   * @returns Promise with payment response including payment URL
   */
  makePayment = async (paymentConfig: PaymentConfigOptions): Promise<PaymentResponse> => {
    try {
      const paymentConfigInstance = new PaymentConfig(paymentConfig);
      const requestData = { ...paymentConfigInstance, ...this.config };

      const response: AxiosResponse<PaymentResponse> = await axios({
        url: baseUrl + 'payment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: stringify(requestData),
        timeout: 10000, // Increased timeout for mobile networks
      });

      if (response.status === 200) {
        // Store payment data in AsyncStorage for later reference
        if (response.data.code === '201' && response.data.data) {
          await PaymentStorage.storePaymentData({
            ...response.data,
            transaction_id: paymentConfigInstance.transaction_id,
            storedAt: new Date().toISOString(),
          });
        }

        return response.data;
      } else {
        throw new Error(`HTTP ${response.status}: Payment initialization failed`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Payment failed: ${error.response.data?.message || error.message}`);
        } else if (error.request) {
          throw new Error('Network error: Unable to reach payment server');
        }
      }
      throw new Error(`Payment initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Check payment transaction status
   *
   * @param transaction_id Transaction ID or payment token from payment initialization
   * @returns Promise with payment status response
   */
  checkPayStatus = async (transaction_id: string): Promise<PaymentStatusResponse> => {
    if (!transaction_id || transaction_id.trim() === '') {
      throw new Error('transaction_id or payment_token is required');
    }

    try {
      const requestData = {
        transaction_id,
        token: transaction_id,
        ...this.config,
      };

      const response: AxiosResponse<PaymentStatusResponse> = await axios({
        url: baseUrl + 'payment/check',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: stringify(requestData),
        timeout: 10000, // Increased timeout for mobile networks
      });

      if (response.status === 200) {
        // Store payment status in AsyncStorage
        if (response.data.code === '00' && response.data.data) {
          await PaymentStorage.storePaymentStatus(transaction_id, {
            ...response.data.data,
            checkedAt: new Date().toISOString(),
          });
        }

        return response.data;
      } else {
        throw new Error(`HTTP ${response.status}: Payment status check failed`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Payment status check failed: ${error.response.data?.message || error.message}`);
        } else if (error.request) {
          throw new Error('Network error: Unable to reach payment server');
        }
      }
      throw new Error(`Payment status check error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Get stored payment data from AsyncStorage
   *
   * @returns Stored payment data or null
   */
  getStoredPaymentData = async (): Promise<any | null> => {
    return PaymentStorage.getPaymentData();
  };

  /**
   * Get stored payment status from AsyncStorage
   *
   * @param transactionId Transaction ID
   * @returns Stored payment status data or null
   */
  getStoredPaymentStatus = async (transactionId: string): Promise<any | null> => {
    return PaymentStorage.getPaymentStatus(transactionId);
  };

  /**
   * Clear all stored payment data
   */
  clearStoredPaymentData = async (): Promise<void> => {
    return PaymentStorage.clearAllPaymentData();
  };

  /**
   * Clear payment data for specific transaction
   *
   * @param transactionId Transaction ID
   */
  clearPaymentDataForTransaction = async (transactionId: string): Promise<void> => {
    return PaymentStorage.clearPaymentData(transactionId);
  };
}
