import AsyncStorage from '@react-native-async-storage/async-storage';

const PAYMENT_STORAGE_PREFIX = '@cinetpay_payment_';
const PAYMENT_STATUS_PREFIX = '@cinetpay_status_';

/**
 * Storage utility for CinetPay payment data using AsyncStorage
 */
export class PaymentStorage {
  /**
   * Store payment initialization data
   *
   * @param paymentData Payment response data from CinetPay
   */
  static async storePaymentData(paymentData: any): Promise<void> {
    try {
      const key = `${PAYMENT_STORAGE_PREFIX}latest`;
      await AsyncStorage.setItem(key, JSON.stringify(paymentData));
    } catch (error) {
      console.warn('Failed to store payment data:', error);
    }
  }

  /**
   * Store payment status data by transaction ID
   *
   * @param transactionId Transaction ID
   * @param statusData Payment status response data
   */
  static async storePaymentStatus(transactionId: string, statusData: any): Promise<void> {
    try {
      const key = `${PAYMENT_STATUS_PREFIX}${transactionId}`;
      await AsyncStorage.setItem(key, JSON.stringify(statusData));
    } catch (error) {
      console.warn('Failed to store payment status:', error);
    }
  }

  /**
   * Retrieve latest payment data
   *
   * @returns Payment data or null if not found
   */
  static async getPaymentData(): Promise<any | null> {
    try {
      const key = `${PAYMENT_STORAGE_PREFIX}latest`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to retrieve payment data:', error);
      return null;
    }
  }

  /**
   * Retrieve payment status by transaction ID
   *
   * @param transactionId Transaction ID
   * @returns Payment status data or null if not found
   */
  static async getPaymentStatus(transactionId: string): Promise<any | null> {
    try {
      const key = `${PAYMENT_STATUS_PREFIX}${transactionId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to retrieve payment status:', error);
      return null;
    }
  }

  /**
   * Clear all payment related data
   */
  static async clearAllPaymentData(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const paymentKeys = allKeys.filter(
        (key) => key.startsWith(PAYMENT_STORAGE_PREFIX) || key.startsWith(PAYMENT_STATUS_PREFIX),
      );
      await AsyncStorage.multiRemove(paymentKeys);
    } catch (error) {
      console.warn('Failed to clear payment data:', error);
    }
  }

  /**
   * Clear payment data for a specific transaction
   *
   * @param transactionId Transaction ID
   */
  static async clearPaymentData(transactionId: string): Promise<void> {
    try {
      const statusKey = `${PAYMENT_STATUS_PREFIX}${transactionId}`;
      await AsyncStorage.removeItem(statusKey);
    } catch (error) {
      console.warn('Failed to clear payment data:', error);
    }
  }
}
