/**
 * J&T Express Mexico API - Customs Service Endpoints
 *
 * Endpoints:
 *   POST /api/customs/declaration               - Customs data push (bill of lading)
 *   POST /api/customs/receiver                  - Pedimento information
 *   POST /api/customs/v1/declarationPackage     - Customs clearance details per package
 *   POST /transport/gps/trajectoryUpload        - Transportista GPS tracking
 */

const PATHS = {
  declaration:         '/api/customs/declaration',
  receiver:            '/api/customs/receiver',
  declarationPackage:  '/api/customs/v1/declarationPackage',
  gpsUpload:           '/transport/gps/trajectoryUpload',
};

// ---------------------------------------------------------------------------
// CUSTOMS DATA PUSH (DECLARATION)
// POST /api/customs/declaration
// ---------------------------------------------------------------------------
// Push customs clearance bill of lading number, box numbers, and PDF for
// customs officers to export clearance data.
//
// bizContent fields:
//   billOfLading          String(30)           Y  - Bill of Lading No.
//   portOfDischarge       String(60)           Y  - Port of discharge
//   airlines              String(30)           N  - Airline company
//   flightNO              String(30)           Y  - Flight number
//   estimatedTransitTime  String(30)           N  - Estimated departure yyyy-MM-dd HH:mm:ss
//   estimatedArrivalTime  String(30)           N  - Estimated arrival yyyy-MM-dd HH:mm:ss
//   actualArrivalTime     String(30)           N  - Actual arrival yyyy-MM-dd HH:mm:ss
//   totalBox              String(30)           N  - Total number of boxes
//   totalQuantity         String(30)           N  - Total number of parcels
//   totalWeight           String(30)           N  - Total weight
//   totalAmount           String(30)           N  - Declared amount
//   consignee             String(30)           N  - Consignee
//   customerCode          String(30)           Y  - Customer code
//   boxNos                list<BoxNoInfo>      Y  - Box number collection
//   operateType           int(4)               N  - 1=Add (default), 2=Void
//   pdf                   String               Y  - PDF file as base64
//   customerName          String(255)          N  - Customer name
//   customerTaxNumber     String(100)          N  - Customer tax ID
//   customerCountry       String(10)           N  - Standard country code
//
// BoxNoInfo fields:
//   boxNo      String(32)      Y  - Carton number
//   billCodes  list<String>    Y  - Waybill numbers in the box
//   Note: If waybill was created >20 days ago, it may delay customs clearance.
//
// Response: { code: "1", msg: "success", data: null }

async function pushCustomsDeclaration(client, bizContent) {
  return client.post(PATHS.declaration, bizContent);
}

// ---------------------------------------------------------------------------
// PEDIMENTO INFORMATION
// POST /api/customs/receiver
// ---------------------------------------------------------------------------
// Used by customs agents to return information from the customs petition file.
//
// bizContent fields:
//   pedimentoNumber  String(30)  Y  - Pedimento number
//   billOfLading     String(30)  Y  - Bill of Lading No.
//   totalAmount      String(30)  Y  - Declared amount total
//   tariffAmount     String(30)  Y  - Tariff amount total
//   pdf              String      Y  - PDF file as base64
//
// Response: { code: "1", msg: "success", data: null }

async function submitPedimentoInfo(client, bizContent) {
  return client.post(PATHS.receiver, bizContent);
}

// ---------------------------------------------------------------------------
// CUSTOMS CLEARANCE DETAILS PER PACKAGE (DECLARATION PACKAGE)
// POST /api/customs/v1/declarationPackage
// ---------------------------------------------------------------------------
// Send package details before customs clearance for declaration purposes.
// Intended for cross-border customers.
//
// bizContent fields:
//   providerOrderId       String(50)    Y  - Customer order number (small package no.)
//   billCode              String(30)    Y  - Waybill number
//   customClearanceType   String(30)    N  - I=Import, E=Export
//   customClearanceBorder String(30)    N  - Airport three-letter code
//   bigBagNo              String(50)    Y  - Box number
//   billOfLading          String(30)    Y  - Bill of lading number
//   customsReceiverContact Object       Y  - Recipient info (see below)
//   customsSenderContact   Object       Y  - Sender info (see below)
//   reportingCurrency     String(30)    Y  - Declared currency
//   packageValue          String(10)    Y  - Total package price (yuan)
//   packageWeight         String(9)     Y  - Total weight in KG
//   weightUnit            String(30)    Y  - Weight unit (kg)
//   items                 List<Object>  Y  - Item details (see below)
//   packageNumber         String(10)    N  - Total shipment waybills
//
// customsReceiverContact / customsSenderContact fields:
//   name         String(100)  Y
//   country      String(60)   Y
//   countryCode  String(20)   Y
//   zip          String(60)   Y
//   prov         String(60)   N
//   city         String(60)   Y
//   area         String(80)   N
//   address      String(300)  Y
//   mobile       String(30)   N  - One of mobile/phone required
//   phone        String(30)   N  - One of mobile/phone required
//   idNumber     String(50)   N  - (receiver only) ID information
//   taxNumber    String(50)   Y  - (receiver only) Tax ID
//   curp         String(50)   N  - (receiver only) Recipient CURP
//   email        String(254)  N  - (receiver only) Email address
//   company      String(60)   N  - (sender only) Shipping company
//
// items fields:
//   skuId          String(50)  N  - Product SKU ID
//   productName    String(80)  Y  - Product name
//   productNameCn  String(80)  N  - Product Chinese name
//   (additional item fields follow standard customs item schema)
//
// Response: { code: "1", msg: "success", data: null }

async function submitDeclarationPackage(client, bizContent) {
  return client.post(PATHS.declarationPackage, bizContent);
}

// ---------------------------------------------------------------------------
// TRANSPORTISTA GPS TRACKING
// POST /transport/gps/trajectoryUpload
// ---------------------------------------------------------------------------
// Upload vehicle GPS location data.
//
// bizContent: Array of GPS entries (send as JSON array, not object)
//   plateNumber     String(60)    N  - License plate number
//   longitude       String(30)    N  - Longitude
//   latitude        String(60)    N  - Latitude
//   address         String(2000)  N  - Detailed address
//   getDataTime     String(60)    N  - GPS data acquisition time yyyy-MM-dd HH:mm:ss
//   uploadDataTime  String(60)    N  - Interface push time yyyy-MM-dd HH:mm:ss
//   speed           String(60)    N  - Speed
//   direction       String(60)    N  - Direction
//
// Response: { code: "1", msg: "success", data: "[]" }

async function uploadGPSTrajectory(client, gpsEntries) {
  // bizContent is an array for this endpoint
  return client.post(PATHS.gpsUpload, gpsEntries);
}

module.exports = {
  PATHS,
  pushCustomsDeclaration,
  submitPedimentoInfo,
  submitDeclarationPackage,
  uploadGPSTrajectory,
};
