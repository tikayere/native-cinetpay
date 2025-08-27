import { CinetPayConfigOptions } from '../models';
import { Cinetpay } from '../cinetpay';

describe('Cinetpay Library Initialization', () => {
  test('should initialize library with valid config', () => {
    const config: CinetPayConfigOptions = {
      apikey: '5579980505863a3f6aabd82.89189525',
      site_id: 659913,
      notify_url: 'https://mon-site-internet.com/notify',
      return_url: 'https://mon-site-internet.com/return',
      lang: 'fr',
    };

    const cinetpay = new Cinetpay(config);
    expect(cinetpay).toBeInstanceOf(Cinetpay);
  });

  test('should throw error with invalid config', () => {
    const invalidConfig = {
      apikey: '',
      site_id: 659913,
      notify_url: 'https://mon-site-internet.com/notify',
      return_url: 'https://mon-site-internet.com/return',
      lang: 'fr' as const,
    };

    expect(() => new Cinetpay(invalidConfig)).toThrow('All configuration fields are required');
  });
});
