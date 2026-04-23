/**
 * J&T Express Mexico API - Main Entry Point
 *
 * Usage:
 *   const JTApi = require('./index');
 *
 *   const api = new JTApi({
 *     apiAccount: 'YOUR_API_ACCOUNT',
 *     privateKey: 'YOUR_PRIVATE_KEY',
 *     customerCode: 'YOUR_CUSTOMER_CODE',
 *     customerPassword: 'YOUR_CUSTOMER_PASSWORD',
 *     timezone: 'GMT-6',
 *     test: true,  // set to false for production
 *   });
 *
 *   // Create an order
 *   const result = await api.orders.createOrder({
 *     customerCode: api.customerCode,
 *     digest: api.bizDigest,
 *     txlogisticId: 'MY-ORDER-001',
 *     expressType: 'EZ',
 *     orderType: '2',
 *     serviceType: '01',
 *     deliveryType: '03',
 *     goodsType: 'bm000006',
 *     weight: '1.5',
 *     operateType: 1,
 *     sender: { ... },
 *     receiver: { ... },
 *   });
 */

const JTClient = require('./client');
const { generateBizDigest } = require('./auth');
const orders  = require('./endpoints/orders');
const logistics = require('./endpoints/logistics');
const other   = require('./endpoints/other');
const customs = require('./endpoints/customs');

class JTApi {
  constructor({ apiAccount, privateKey, customerCode, customerPassword, timezone = 'GMT-6', test = false }) {
    this._client = new JTClient({ apiAccount, privateKey, timezone, test });
    this.customerCode = customerCode;

    // Pre-compute business digest if credentials provided
    this.bizDigest = customerCode && customerPassword && privateKey
      ? generateBizDigest(customerCode, customerPassword, privateKey)
      : null;

    // Bind endpoint modules to this client
    this.orders = {
      createOrder:    (biz) => orders.createOrder(this._client, biz),
      queryOrders:    (biz) => orders.queryOrders(this._client, biz),
      cancelOrder:    (biz) => orders.cancelOrder(this._client, biz),
      getWaybillLabel:(biz) => orders.getWaybillLabel(this._client, biz),
    };

    this.logistics = {
      queryTrack:      (biz) => logistics.queryTrack(this._client, biz),
      subscribeTrack:  (biz) => logistics.subscribeTrack(this._client, biz),
      trackCallbackHandler: logistics.trackCallbackHandler,
    };

    this.other = {
      checkPostCodeCoverage:  (biz) => other.checkPostCodeCoverage(this._client, biz),
      calculateFreight:       (biz) => other.calculateFreight(this._client, biz),
      queryNetworkByZipCode:  (biz) => other.queryNetworkByZipCode(this._client, biz),
    };

    this.customs = {
      pushCustomsDeclaration:   (biz) => customs.pushCustomsDeclaration(this._client, biz),
      submitPedimentoInfo:      (biz) => customs.submitPedimentoInfo(this._client, biz),
      submitDeclarationPackage: (biz) => customs.submitDeclarationPackage(this._client, biz),
      uploadGPSTrajectory:      (entries) => customs.uploadGPSTrajectory(this._client, entries),
    };
  }
}

module.exports = JTApi;
