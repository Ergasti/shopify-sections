/**
 * J&T Express Mexico API - Configuration
 * Base URLs and shared constants
 */

const JT_CONFIG = {
  baseUrl: {
    test: 'https://demoopenapi.jtjms-mx.com/webopenplatformapi',
    production: 'https://openapi.jtjms-mx.com/webopenplatformapi',
  },

  // Test credentials (replace with real credentials in production)
  testCredentials: {
    apiAccount: '292508153084379141',
    privateKey: 'a0a1047cce70493c9d5d29704f05d0d9',
  },

  timezones: ['GMT-5', 'GMT-6', 'GMT-7', 'GMT-8'],

  goodsTypes: {
    bm000001: 'Document',
    bm000002: 'Digital product',
    bm000003: 'Daily necessities',
    bm000004: 'Food',
    bm000005: 'Apparel',
    bm000006: 'Others',
    bm000007: 'Fresh food',
    bm000008: 'Fragile goods',
    bm000009: 'Liquid',
  },

  orderStatus: {
    100: 'Not dispatched',
    101: 'Outlets dispatched',
    102: 'Salesperson dispatched',
    103: 'Picked up',
    104: 'Cancelled',
  },

  scanTypes: {
    10:  'Express mail collection',
    50:  'Outgoing Scan',
    92:  'Arrival Scan',
    94:  'On Delivery',
    100: 'Express receipt',
    110: 'Problem scan',
    111: 'Return signature',
    172: 'Return Scan',
    200: 'Warehouse-in scan',
    201: 'Express take out scan',
    202: 'Agent Point Collection Scan',
    300: 'Warehouse-out scan',
    310: 'Carga en almacén fiscalizado',
    320: 'Almacenaje logístico',
    330: 'Despacho aduanero completado',
  },
};

module.exports = JT_CONFIG;
