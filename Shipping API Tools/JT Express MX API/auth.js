/**
 * J&T Express Mexico API - Authentication / Signature Generation
 *
 * Signature method:
 *   digest = base64( md5( bizContentJson + privateKey ) )
 *   Note: md5 produces a byte array first, then base64-encode it.
 *
 * Business-level digest (inside bizContent):
 *   digest = base64( md5( customerCode + ciphertext + privateKey ) )
 *   where ciphertext = MD5( cleartextPassword + 'jadada236t2' ).toUpperCase()
 */

const crypto = require('crypto');

/**
 * Generate the header-level digest signature.
 * @param {string} bizContentJson - JSON string of business parameters
 * @param {string} privateKey - Platform-issued private key
 * @returns {string} base64-encoded MD5 signature
 */
function generateHeaderDigest(bizContentJson, privateKey) {
  const raw = bizContentJson + privateKey;
  const md5Bytes = crypto.createHash('md5').update(raw, 'utf8').digest();
  return md5Bytes.toString('base64');
}

/**
 * Generate the business-level digest (inside bizContent).
 * @param {string} customerCode
 * @param {string} cleartextPassword - Plain-text customer password
 * @param {string} privateKey - Platform-issued private key
 * @returns {string} base64-encoded signature
 */
function generateBizDigest(customerCode, cleartextPassword, privateKey) {
  const ciphertext = crypto
    .createHash('md5')
    .update(cleartextPassword + 'jadada236t2', 'utf8')
    .digest('hex')
    .toUpperCase();

  const raw = customerCode + ciphertext + privateKey;
  const md5Bytes = crypto.createHash('md5').update(raw, 'utf8').digest();
  return md5Bytes.toString('base64');
}

/**
 * Build the standard request headers.
 * @param {string} bizContentJson - JSON string of business parameters
 * @param {string} apiAccount - Platform API account ID
 * @param {string} privateKey - Platform private key
 * @param {string} [timezone='GMT-6'] - Timezone string
 * @returns {object} Headers object ready for fetch/axios
 */
function buildHeaders(bizContentJson, apiAccount, privateKey, timezone = 'GMT-6') {
  const timestamp = Date.now();
  const digest = generateHeaderDigest(bizContentJson, privateKey);

  return {
    apiAccount: String(apiAccount),
    digest,
    timestamp: String(timestamp),
    timezone,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
}

/**
 * Encode bizContent as a URL-encoded form body.
 * @param {string} bizContentJson
 * @returns {string} URL-encoded body string
 */
function buildBody(bizContentJson) {
  return 'bizContent=' + encodeURIComponent(bizContentJson);
}

module.exports = {
  generateHeaderDigest,
  generateBizDigest,
  buildHeaders,
  buildBody,
};
