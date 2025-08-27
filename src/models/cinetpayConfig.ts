export interface CinetPayConfigOptions {
  apikey: string;
  site_id: number;
  notify_url: string;
  return_url: string;
  lang: 'fr' | 'en';
}

export class CinetPayConfig {
  apikey: string;
  site_id: number;
  notify_url: string;
  return_url: string;
  lang: 'fr' | 'en';

  constructor(config: CinetPayConfigOptions) {
    // Validate required fields
    if (!config.apikey || !config.site_id || !config.notify_url || !config.return_url || !config.lang) {
      throw new Error('All configuration fields are required: apikey, site_id, notify_url, return_url, lang');
    }

    this.apikey = config.apikey;
    this.site_id = config.site_id;
    this.notify_url = config.notify_url;
    this.return_url = config.return_url;
    this.lang = config.lang;
  }
}
