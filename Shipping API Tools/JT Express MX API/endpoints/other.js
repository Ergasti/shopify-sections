/**
 * J&T Express Mexico API - Other Service Endpoints
 *
 * Endpoints:
 *   POST /api/online/postCodeCover      - Collection & delivery range query
 *   POST /api/spmComCost/getComCost     - Freight calculation
 *   POST /api/network/getInfoByZipCode  - Network query by zip code
 */

const PATHS = {
  postCodeCover:    '/api/online/postCodeCover',
  freightCalc:      '/api/spmComCost/getComCost',
  networkByZipCode: '/api/network/getInfoByZipCode',
};

// ---------------------------------------------------------------------------
// COLLECTION & DELIVERY RANGE QUERY
// POST /api/online/postCodeCover
// ---------------------------------------------------------------------------
// Check whether a zip code is within J&T's service area.
//
// bizContent fields:
//   postCode  Number  Y  - Zip code to check
//
// Response data:
//   data  boolean  - true = serviceable, false = not serviceable

async function checkPostCodeCoverage(client, bizContent) {
  return client.post(PATHS.postCodeCover, bizContent);
}

// ---------------------------------------------------------------------------
// FREIGHT CALCULATION
// POST /api/spmComCost/getComCost
// ---------------------------------------------------------------------------
// Calculate shipping cost based on origin/destination zip codes and package info.
//
// bizContent fields:
//   customerCode        String(30)  Y
//   digest              String(50)  Y
//   originZipCode       String(20)  Y  - Sender zip code
//   destinationZipCode  String(20)  Y  - Recipient zip code
//   length              int(6)      N  - CM
//   width               int(6)      N  - CM
//   height              int(6)      N  - CM
//   weight              String(12)  Y  - kg, range 0.01-30
//   productType         String(20)  Y  - Fixed value: "EZ"
//   itemType            String(50)  Y  - bm000001..bm000008
//
// Response data:
//   totalPrice  String  Y  - Total freight in MXN (2 decimal places)

async function calculateFreight(client, bizContent) {
  return client.post(PATHS.freightCalc, bizContent);
}

// ---------------------------------------------------------------------------
// NETWORK QUERY BY ZIP CODE
// POST /api/network/getInfoByZipCode
// ---------------------------------------------------------------------------
// Query J&T outlet/network information for a given zip code.
//
// bizContent fields:
//   customerCode  String(30)  N
//   digest        String(50)  Y
//   zipCode       String(5)   Y  - Zip code (e.g. "01728")
//
// Response data (array):
//   networkName     String  Y  - Outlet name
//   networkType     String  Y  - Outlet type (e.g. "Shipping point", "Dispatch point")
//   networkAddress  String  Y  - Full address
//   contacts        String  Y  - Contact person name
//   telephone       String  N  - Phone number
//   mobile          String  Y  - Mobile number
//   businessTime    String  N  - Business hours (e.g. "16:00:00～04:00:00")
//   longitude       String  N
//   latitude        String  N

async function queryNetworkByZipCode(client, bizContent) {
  return client.post(PATHS.networkByZipCode, bizContent);
}

module.exports = {
  PATHS,
  checkPostCodeCoverage,
  calculateFreight,
  queryNetworkByZipCode,
};
