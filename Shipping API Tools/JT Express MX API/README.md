# J&T Express Mexico API

JavaScript client for the J&T Express (极兔) Mexico Open Platform API.

## Endpoints

### Order Service

| Function | Method | Path | Description |
|---|---|---|---|
| `createOrder` | POST | `/api/order/addOrder` | Create or modify an order |
| `queryOrders` | POST | `/api/order/getOrders` | Query orders by number, waybill, or date range |
| `cancelOrder` | POST | `/api/order/cancelOrder` | Cancel an order |
| `getWaybillLabel` | POST | `/api/order/printOrder` | Get waybill label as PDF base64 or ZPL |

### Logistics Trajectory

| Function | Method | Path | Description |
|---|---|---|---|
| `queryTrack` | POST | `/api/logistics/trace` | Query logistics track by waybill (up to 30 at once) |
| `subscribeTrack` | POST | `/api/trace/subscribe` | Subscribe to logistics push notifications |
| `trackCallbackHandler` | POST | *(customer URL)* | Express middleware to receive J&T push callbacks |

### Other Service

| Function | Method | Path | Description |
|---|---|---|---|
| `checkPostCodeCoverage` | POST | `/api/online/postCodeCover` | Check if a zip code is within service area |
| `calculateFreight` | POST | `/api/spmComCost/getComCost` | Calculate shipping cost |
| `queryNetworkByZipCode` | POST | `/api/network/getInfoByZipCode` | Get outlet/network info by zip code |

### Customs Service

| Function | Method | Path | Description |
|---|---|---|---|
| `pushCustomsDeclaration` | POST | `/api/customs/declaration` | Push bill of lading & box numbers for customs |
| `submitPedimentoInfo` | POST | `/api/customs/receiver` | Return pedimento file information |
| `submitDeclarationPackage` | POST | `/api/customs/v1/declarationPackage` | Submit package-level customs declaration details |
| `uploadGPSTrajectory` | POST | `/transport/gps/trajectoryUpload` | Upload vehicle GPS tracking data |

## Base URLs

| Environment | Base URL |
|---|---|
| Test | `https://demoopenapi.jtjms-mx.com/webopenplatformapi` |
| Production | `https://openapi.jtjms-mx.com/webopenplatformapi` |

## Authentication

All requests require these headers:

| Header | Type | Description |
|---|---|---|
| `apiAccount` | Number | Platform-issued API account ID |
| `digest` | String | `base64(md5(bizContentJson + privateKey))` |
| `timestamp` | Number | Current time in milliseconds |
| `timezone` | String | One of: `GMT-5`, `GMT-6`, `GMT-7`, `GMT-8` |

Body must be `application/x-www-form-urlencoded` with a single `bizContent` key containing the JSON-encoded business parameters.

### Business-level digest (inside bizContent)

```
ciphertext = MD5(cleartextPassword + "jadada236t2").toUpperCase()
digest = base64(MD5(customerCode + ciphertext + privateKey))
```

## Usage

```js
const JTApi = require('./index');

const api = new JTApi({
  apiAccount: '292508153084379141',
  privateKey: 'a0a1047cce70493c9d5d29704f05d0d9',
  customerCode: 'J0086024119',
  customerPassword: 'W261smo0',
  timezone: 'GMT-6',
  test: true,
});

// Check zip code coverage
const coverage = await api.other.checkPostCodeCoverage({ postCode: '06060' });
console.log(coverage.data); // true or false

// Calculate freight
const freight = await api.other.calculateFreight({
  customerCode: api.customerCode,
  digest: api.bizDigest,
  originZipCode: '06060',
  destinationZipCode: '47000',
  weight: '1.5',
  productType: 'EZ',
  itemType: 'bm000006',
});
console.log(freight.data.totalPrice); // e.g. "9.24"

// Create an order
const order = await api.orders.createOrder({
  customerCode: api.customerCode,
  digest: api.bizDigest,
  txlogisticId: 'MY-ORDER-001',
  expressType: 'EZ',
  orderType: '2',
  serviceType: '01',
  deliveryType: '03',
  goodsType: 'bm000006',
  weight: '1',
  operateType: 1,
  sender: {
    name: 'Sender Name',
    postCode: '06060',
    mobile: '5512345678',
    countryCode: 'MEX',
    prov: 'CIUDAD DE MEXICO',
    city: 'CUAUHTEMOC',
    area: 'COLONIA CENTRO',
    address: 'Calle Venustiano Carranza 100',
  },
  receiver: {
    name: 'Receiver Name',
    postCode: '05348',
    mobile: '5598765432',
    countryCode: 'MEX',
    prov: 'CDMX',
    city: 'CUAJIMALPA',
    area: 'LOMAS DE SANTA FE',
    address: 'Calle Mario Pani 230',
  },
});
console.log(order.data.billCode); // e.g. "JMX000299299920"
```

## Response Format

All responses follow this envelope:

```json
{
  "code": "1",
  "msg": "success",
  "data": { ... }
}
```

| code | Meaning |
|---|---|
| `"1"` | Success |
| `"0"` | Failed |
| `"145003030"` | Headers signature failed |
| `"145003071"` | apiAccount is null |
| `"145005000"` | System error |

## File Structure

```
JT Express MX API/
├── index.js              Main entry point / API class
├── client.js             Base HTTP client
├── auth.js               Signature generation utilities
├── config.js             Constants (URLs, goods types, scan codes)
└── endpoints/
    ├── orders.js         Order service (create, query, cancel, print)
    ├── logistics.js      Logistics track (query, subscribe, webhook)
    ├── other.js          Other services (coverage, freight, network)
    └── customs.js        Customs (declaration, pedimento, packages, GPS)
```
