// netlify/functions/cf-verify-order.js
// Fresh Cashfree order verification (Sandbox by default)
// - Expects POST JSON: { order_id: string }
// - Returns: { verified: boolean, status: string, amount?: number, currency?: string, order?: object }

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return textResponse(405, 'Method Not Allowed');
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const orderId = String(body.order_id || '').trim();

    if (!orderId) {
      return jsonResponse(400, { error: 'order_id_required' });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secret = process.env.CASHFREE_SECRET_KEY;
    const env = String(process.env.CF_ENV || 'SANDBOX').toUpperCase();
    const apiVersion = process.env.CF_API_VERSION || '2023-08-01';
    if (!appId || !secret) {
      safeLog('ERROR', 'cf-verify-order', { order_id: orderId, message: 'Missing credentials' });
      return jsonResponse(500, { error: 'server_not_configured' });
    }

    const base = env === 'PRODUCTION' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';

    const resp = await fetch(`${base}/pg/orders/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secret,
        'x-api-version': apiVersion,
        'Accept': 'application/json'
      }
    });

    const text = await resp.text();
    if (!resp.ok) {
      safeLog('ERROR', 'cf-verify-order', {
        order_id: orderId,
        env,
        status: resp.status,
        body: shorten(text, 500)
      });
      return jsonResponse(502, { error: 'provider_error', status: resp.status, detail: tryParseJSON(text) || text });
    }

    const data = tryParseJSON(text) || {};
    const orderStatus = String(data.order_status || '').toUpperCase();
    const verified = orderStatus === 'PAID';

    safeLog('INFO', 'cf-verify-order', {
      order_id: orderId,
      env,
      status: orderStatus,
      verified
    });

    return jsonResponse(200, {
      verified,
      status: orderStatus,
      amount: data.order_amount,
      currency: data.order_currency,
      order: data
    });
  } catch (e) {
    safeLog('ERROR', 'cf-verify-order', { message: 'Unhandled error', detail: String(e && (e.stack || e)) });
    return jsonResponse(500, { error: 'server_error' });
  }
}

/* ------------------------ Helpers ------------------------ */

function jsonResponse(status, obj) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  };
}

function textResponse(status, text) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    body: text
  };
}

function safeLog(level, moduleName, obj) {
  try {
    const log = {
      level,
      timestamp: new Date().toISOString(),
      module: moduleName,
      ...obj
    };
    console.log(JSON.stringify(log));
  } catch {
    // no-op
  }
}

function tryParseJSON(s) {
  try { return JSON.parse(s); } catch { return null; }
}

function shorten(s, max) {
  if (typeof s !== 'string') return s;
  return s.length > max ? s.slice(0, max) + '…' : s;
}