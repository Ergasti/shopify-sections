/**
 * J&T Express Mexico API - Order Service Endpoints
 *
 * Endpoints:
 *   POST /api/order/addOrder        - Create / modify order
 *   POST /api/order/getOrders       - Query orders
 *   POST /api/order/cancelOrder     - Cancel order
 *   POST /api/order/printOrder      - Get waybill label (PDF / ZPL)
 */

const PATHS = {
  createOrder: '/api/order/addOrder',
  queryOrders: '/api/order/getOrders',
  cancelOrder: '/api/order/cancelOrder',
  printOrder:  '/api/order/printOrder',
};

// ---------------------------------------------------------------------------
// CREATE / MODIFY ORDER
// POST /api/order/addOrder
// ---------------------------------------------------------------------------
// bizContent fields:
//   customerCode    String(30)  Y  - Customer code
//   digest          String(50)  Y  - Business-level signature
//   network         String(30)  N  - Cooperation outlet
//   txlogisticId    String(50)  Y  - Customer's own order number
//   expressType     String(30)  Y  - Express type (only "EZ")
//   orderType       String(11)  Y  - 1=Individual, 2=Monthly settlement
//   serviceType     String(30)  Y  - 02=Store delivery, 01=Door-to-door pickup
//   deliveryType    String(30)  Y  - 03=Home delivery, 06=Store pickup
//   payType         String(30)  N  - e.g. "PP_PM" (send payment monthly)
//   sender          Object      Y  - See sender fields below
//   receiver        Object      Y  - See receiver fields below
//   sendStartTime   String(30)  N  - yyyy-MM-dd HH:mm:ss
//   sendEndTime     String(30)  N  - yyyy-MM-dd HH:mm:ss
//   goodsType       String(30)  Y  - bm000001..bm000009
//   length          int(6)      N  - CM
//   width           int(6)      N  - CM
//   height          int(6)      N  - CM
//   weight          String(12)  Y  - kg, range 0.01-30
//   totalQuantity   int(4)      N  - Must be 1
//   itemsValue      String(12)  N  - Payment amount (numeric)
//   priceCurrency   String(32)  N  - Currency of payment
//   offerFee        String(12)  N  - Insured amount (numeric)
//   remark          String(200) N  - Remark
//   items           Object      N  - Product information list
//   customsInfo     Object      N  - Customs information
//   operateType     int(4)      Y  - 1=Adding, 2=Modifying
//
// sender / receiver fields:
//   name            String(32)  Y
//   company         String(100) N
//   postCode        String(32)  Y
//   mailBox         String(150) N
//   mobile          String(30)  Y  - One of mobile/phone required
//   phone           String(30)  Y  - One of mobile/phone required
//   countryCode     String(20)  Y  - Three-char country code (e.g. MEX)
//   prov            String(32)  Y  - State
//   city            String(32)  Y
//   area            String(32)  Y  - District
//   address         String(256) Y
//   address2        String(256) N  - Alternate address
//   receiverAddressLng String(12) N - Longitude (receiver only)
//   receiverAddressLat String(12) N - Latitude (receiver only)
//
// items fields:
//   itemType        String(30)  N  - bm000001..bm000008
//   itemName        String(30)  N
//   chineseName     String(60)  N
//   englishName     String(60)  N
//   number          int(4)      N  - Quantity (≥1)
//   itemValue       String(20)  N  - Declared value (SKU total price)
//   priceCurrency   String(20)  N
//   desc            String(100) N
//   itemUrl         String(100) N
//   goodsCategoryCode String(32) N
//
// customsInfo fields:
//   count                    Number(5)     N
//   unit                     String(30)    N
//   sourceArea               String(5)     N  - Country of origin
//   productRecordNo          String(18)    N
//   goodPrepardNo            String(100)   N
//   taxNo                    String(100)   N
//   hsCode                   String(100)   N
//   goodsCode                String(60)    N
//   brand                    String(60)    N
//   specifications           String(60)    N
//   manufacturer             String(100)   N
//   cargoDeclaredValue       Double(16,5)  N
//   declaredValueDeclaredCurrency String(5) N
//   customerFreight          String(100)   N
//
// Response data:
//   lastCenterName  String  N  - Collection land
//   txlogisticId    String  Y  - Customer order number
//   createOrderTime String  Y  - yyyy-MM-dd HH:mm:ss
//   sortingCode     String  Y  - Three-segment code
//   sumFreight      String  N  - Total freight (numeric)
//   billCode        String  Y  - Waybill number

async function createOrder(client, bizContent) {
  return client.post(PATHS.createOrder, bizContent);
}

// ---------------------------------------------------------------------------
// QUERY ORDERS
// POST /api/order/getOrders
// ---------------------------------------------------------------------------
// bizContent fields:
//   customerCode  String(30)  Y
//   digest        String(50)  Y
//   command       int(5)      Y  - 1=by customer order no, 2=by waybill no,
//                                  3=by time range, 4=by order serial no
//   serialNumber  List[]      N  - Required for command 1, 2, or 4 (max 200)
//   startDate     String(30)  N  - Required for command=3 (yyyy-MM-dd HH:mm:ss)
//   endDate       String(30)  N  - Required for command=3 (max 7-day range)
//   status        int(10)     N  - Filter by status (100/101/102/103/104)
//   current       int         N  - Page number (required for command=3)
//   size          int         N  - Page size (required for command=3)
//
// Response data (per order):
//   lastCenterName  String  N
//   orderNumber     long    Y  - System order number
//   txlogisticId    String  Y
//   expressType     String  Y
//   orderStatus     String  Y  - 100/101/102/103/104
//   orderType       String  Y
//   serviceType     String  Y
//   deliveryType    String  Y
//   sortingCode     String  Y
//   sumFreight      String  N
//   sender          Object  Y
//   receiver        Object  Y
//   sendStartTime   String  N
//   sendEndTime     String  N
//   goodsType       String  Y
//   length/width/height/volume int N
//   weight          int     Y
//   totalQuantity   int     N
//   itemsValue      String  N
//   priceCurrency   String  N
//   offerFee        String  N
//   remark          String  N
//   items           List    N
//   createOrderTime String  Y

async function queryOrders(client, bizContent) {
  return client.post(PATHS.queryOrders, bizContent);
}

// ---------------------------------------------------------------------------
// CANCEL ORDER
// POST /api/order/cancelOrder
// ---------------------------------------------------------------------------
// bizContent fields:
//   customerCode  String(30)  N  - Required when orderType=2
//   digest        String(50)  N
//   orderType     String(30)  Y  - 1=Individual, 2=Contract customer
//   txlogisticId  String(50)  Y  - Customer order number
//   reason        String(50)  Y  - Reason for cancellation
//
// Response data:
//   billCode      String  Y  - Waybill number
//   txlogisticId  String  Y  - Customer order number

async function cancelOrder(client, bizContent) {
  return client.post(PATHS.cancelOrder, bizContent);
}

// ---------------------------------------------------------------------------
// GET WAYBILL LABEL (PRINT ORDER)
// POST /api/order/printOrder
// ---------------------------------------------------------------------------
// bizContent fields:
//   customerCode  String(30)  Y
//   digest        String(50)  Y
//   billCode      String(50)  Y  - Waybill number
//   printSize     int         Y  - 0=76×130mm, 1=100×200mm
//   printType     int(5)      N  - 1 or null=PDF base64, 2=ZPL format
//
// Response data:
//   billCode              String  Y
//   serviceProvider       String  N  - e.g. "J&T express"
//   base64EncodeContent   String  Y  - Base64 file content

async function getWaybillLabel(client, bizContent) {
  return client.post(PATHS.printOrder, bizContent);
}

module.exports = {
  PATHS,
  createOrder,
  queryOrders,
  cancelOrder,
  getWaybillLabel,
};
