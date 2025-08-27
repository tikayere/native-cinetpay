export interface PaymentConfigOptions {
  transaction_id: string;
  amount: number;
  currency: 'XOF' | 'XAF' | 'CDF' | 'GNF';
  description: string;
  channels: 'ALL' | 'MOBILE_MONEY' | 'CREDIT_CARD';
  customer_id?: string;
  customer_name?: string;
  customer_surname?: string;
  metadata?: Record<string, unknown>;
  customer_phone_number?: string;
  customer_email?: string;
  customer_address?: string;
  customer_city?: string;
  customer_country?: string;
  customer_state?: string;
  customer_zip_code?: string;
}

export class PaymentConfig {
  transaction_id: string;
  amount: number;
  currency: 'XOF' | 'XAF' | 'CDF' | 'GNF';
  description: string;
  customer_id?: string;
  customer_name?: string;
  customer_surname?: string;
  channels: 'ALL' | 'MOBILE_MONEY' | 'CREDIT_CARD';
  metadata?: Record<string, unknown>;
  customer_phone_number?: string;
  customer_email?: string;
  customer_address?: string;
  customer_city?: string;
  customer_country?: string;
  customer_state?: string;
  customer_zip_code?: string;

  constructor(config: PaymentConfigOptions) {
    // Validate required fields
    if (!config.transaction_id || !config.amount || !config.currency || !config.description || !config.channels) {
      throw new Error('Required fields missing: transaction_id, amount, currency, description, channels');
    }

    // Validate amount is positive
    if (config.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    this.transaction_id = config.transaction_id;
    this.amount = config.amount;
    this.currency = config.currency;
    this.description = config.description;
    this.channels = config.channels;
    this.customer_id = config.customer_id;
    this.customer_name = config.customer_name;
    this.customer_surname = config.customer_surname;
    this.metadata = config.metadata;
    this.customer_phone_number = config.customer_phone_number;
    this.customer_email = config.customer_email;
    this.customer_address = config.customer_address;
    this.customer_city = config.customer_city;
    this.customer_country = config.customer_country;
    this.customer_state = config.customer_state;
    this.customer_zip_code = config.customer_zip_code;
  }
}
