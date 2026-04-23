/**
 * J&T Express Mexico API - Logistics Trajectory Endpoints
 *
 * Endpoints:
 *   POST /api/logistics/trace    - Query logistics track by waybill number
 *   POST /api/trace/subscribe    - Subscribe to track push notifications
 *   WEBHOOK (customer URL)       - Receive logistics track callbacks (statusFeedback)
 */

const PATHS = {
  trackQuery:     '/api/logistics/trace',
  trackSubscribe: '/api/trace/subscribe',
  // statusFeedback is a webhook received at the customer's own URL
};

// ---------------------------------------------------------------------------
// LOGISTICS TRACK QUERY
// POST /api/logistics/trace
// ---------------------------------------------------------------------------
// bizContent fields:
//   customerCode  String(30)  Y
//   digest        String(50)  Y
//   billCodes     String(500) Y  - Comma-separated waybill numbers (max 30)
//
// Response data (array per waybill):
//   billCode  String  Y  - Waybill number
//   details   Array   Y  - Track detail entries
//
// details fields:
//   scanTime              String  Y  - Scan time
//   desc                  String  Y  - Trajectory description
//   scanType              String  Y  - Scan type name
//   scanCode              String  Y  - Scan type code (see config.js scanTypes)
//   problemType           String  Y  - Scan dot type
//   scanNetworkTypeName   String  Y  - Problem code
//   scanNetworkName       String  Y  - Scan site name
//   scanNetworkId         String  Y  - Scan site ID
//   staffName             String  Y  - Salesman name
//   staffContact          String  Y  - Salesman contact
//   scanNetworkContact    String  Y  - Scan outlet contact
//   scanNetworkProvince   String  Y  - Scan outlet province
//   scanNetworkCity       String  Y  - Scan outlet city
//   scanNetworkArea       String  Y  - Scan outlet district
//   nextStopName          String  Y  - Last/next stop name
//   nextNetworkProvinceName String Y  - Next stop province (on outgoing scan)
//   nextNetworkCityName   String  Y  - Next stop city (on outgoing scan)
//   nextNetworkAreaName   String  Y  - Next stop district (on outgoing scan)
//   sigPicUrl             String  Y  - Receipt picture URL (on delivery scan)
//   longitude             String  N  - Longitude (required on delivery scan)
//   latitude              String  N  - Latitude (required on delivery scan)

async function queryTrack(client, bizContent) {
  return client.post(PATHS.trackQuery, bizContent);
}

// ---------------------------------------------------------------------------
// LOGISTICS TRACK SUBSCRIPTION
// POST /api/trace/subscribe
// ---------------------------------------------------------------------------
// Note: Must provide customer URL for the push callback before subscribing.
//
// bizContent fields:
//   customerCode  String(30)  Y
//   digest        String(50)  Y
//   Id            Number      Y  - API account ID
//   list          Object      Y  - Array of subscription entries
//
// list item fields:
//   traceNode   String(32)  Y  - Nodes to subscribe, e.g. "1&2&3&10"
//                                 310=Carga en almacén fiscalizado
//                                 330=Despacho aduanero completado
//                                 320=Almacenaje logístico
//                                 1=Express mail collection
//                                 2=In-stock scanning
//                                 3=Outgoing scanning
//                                 4=Incoming scanning
//                                 5=Outbound scanning
//                                 6=Inbound scan
//                                 7=Agent Point Revenue Scan
//                                 8=Express take out scan
//                                 9=Outbound scan
//                                 10=Express delivery
//                                 11=Scanning for problems
//                                 172=Return Scan
//                                 12=Return receipt
//   waybillCode String(32)  Y  - J&T waybill number
//
// Response: { code: "1", msg: "success", data: "SUCCESS" }

async function subscribeTrack(client, bizContent) {
  return client.post(PATHS.trackSubscribe, bizContent);
}

// ---------------------------------------------------------------------------
// LOGISTICS TRACK CALLBACK (WEBHOOK - RECEIVED FROM J&T)
// POST <customer-provided URL>
// ---------------------------------------------------------------------------
// J&T pushes logistics updates to the customer's endpoint.
// The customer's server must respond with: { code: "1", msg: "success", data: "" }
//
// Incoming bizContent fields:
//   billCode     String(30)  Y  - Waybill number
//   txlogisticId String(60)  N  - Customer order number
//   details      Array       Y  - Same structure as trackQuery details
//
// details fields: (same as trackQuery response details above)
//   scanTime, desc, scanType, scanCode, problemType,
//   scanNetworkTypeName, scanNetworkName, scanNetworkId,
//   staffName, staffContact, scanNetworkContact,
//   scanNetworkProvince, scanNetworkCity, scanNetworkArea,
//   nextStopName, sigPicUrl, electronicSignaturePicUrl,
//   longitude, latitude

/**
 * Express/Node handler for the logistics track webhook.
 * Mount this on your server at whatever URL you registered with J&T.
 *
 * @example
 *   app.post('/jt/track-callback', trackCallbackHandler);
 */
function trackCallbackHandler(req, res) {
  try {
    const bizContent = req.body?.bizContent
      ? JSON.parse(req.body.bizContent)
      : req.body;

    const { billCode, txlogisticId, details = [] } = bizContent;

    // TODO: process the incoming track update
    console.log(`[JT Track] billCode=${billCode} txlogisticId=${txlogisticId}`);
    details.forEach((d) => {
      console.log(`  [${d.scanTime}] ${d.scanType} (${d.scanCode}): ${d.desc}`);
    });

    // J&T requires this exact success response
    res.json({ code: '1', msg: 'success', data: '' });
  } catch (err) {
    console.error('[JT Track] Callback error:', err);
    res.status(500).json({ code: '0', msg: 'error', data: null });
  }
}

module.exports = {
  PATHS,
  queryTrack,
  subscribeTrack,
  trackCallbackHandler,
};
