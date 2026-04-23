/**
 * J&T Express Mexico API - Base HTTP Client
 */

const { buildHeaders, buildBody } = require('./auth');
const JT_CONFIG = require('./config');

class JTClient {
  /**
   * @param {object} options
   * @param {string} options.apiAccount
   * @param {string} options.privateKey
   * @param {string} [options.timezone='GMT-6']
   * @param {boolean} [options.test=false] - Use test environment
   */
  constructor({ apiAccount, privateKey, timezone = 'GMT-6', test = false }) {
    this.apiAccount = apiAccount;
    this.privateKey = privateKey;
    this.timezone = timezone;
    this.baseUrl = test ? JT_CONFIG.baseUrl.test : JT_CONFIG.baseUrl.production;
  }

  /**
   * Send a POST request to the given path with bizContent.
   * @param {string} path - API path (e.g. '/api/order/addOrder')
   * @param {object} bizContent - Business parameter object
   * @returns {Promise<object>} Parsed JSON response
   */
  async post(path, bizContent) {
    const bizContentJson = JSON.stringify(bizContent);
    const headers = buildHeaders(bizContentJson, this.apiAccount, this.privateKey, this.timezone);
    const body = buildBody(bizContentJson);
    const url = this.baseUrl + path;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

module.exports = JTClient;
