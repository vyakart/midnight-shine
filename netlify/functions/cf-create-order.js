// netlify/functions/cf-create-order.js
// Fresh Cashfree order creation (Sandbox by default)
// - Expects: POST JSON { amount: number (INR rupees), currency?: "INR", donor?: { id?, email?, phone? }, notes?: { note?, description? } }
// - Returns: { mode, order_id, payment_session_id, order }

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return textResponse(405, 'Method Not Allowed');
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const rawAmount = body.amount ?? body.order_amount ?? null;
    const currency = String(body.currency || body.order_currency || 'INR').toUpperCase();
    const donor = body.donor || {};
    const notes = body.notes || {};

    if (!isFinite(rawAmount) || Number(rawAmount) <= 0) {
      return jsonResponse(400, { error: 'invalid_amount' });
    }
    if (currency !== 'INR') {
      return jsonResponse(400, { error: 'currency_must_be_INR' });
    }

    const amount = round2(Number(rawAmount));

    const appId = process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID;
    const secret = process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_SECRET_KEY;
    const env = String(process.env.CF_ENV || 'SANDBOX').toUpperCase();
    const apiVersion = process.env.CF_API_VERSION || '2023-08-01';
    if (!appId || !secret) {
      safeLog('ERROR', 'cf-create-order', {
        message: 'Missing credentials',
        have_app: !!process.env.CASHFREE_APP_ID,
        have_client: !!process.env.CASHFREE_CLIENT_ID,
        have_secret_app: !!process.env.CASHFREE_SECRET_KEY,
        have_secret_client: !!process.env.CASHFREE_CLIENT_SECRET,
        env
      });
      return jsonResponse(500, {
        error: 'server_not_configured',
        detail: {
          missing_client_id: !appId,
          missing_secret: !secret,
          env,
          creds_source: (process.env.CASHFREE_CLIENT_ID ? 'CLIENT' : (process.env.CASHFREE_APP_ID ? 'APP' : 'NONE'))
        }
      });
    }

    const base = env === 'PRODUCTION' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
    safeLog('INFO', 'cf-create-order.debug', {
      env,
      base,
      apiVersion,
      creds_source: (process.env.CASHFREE_CLIENT_ID ? 'CLIENT' : (process.env.CASHFREE_APP_ID ? 'APP' : 'NONE')),
      have_app: !!process.env.CASHFREE_APP_ID,
      have_client: !!process.env.CASHFREE_CLIENT_ID
    });

    const orderId = (body.order_id && String(body.order_id)) || makeOrderId();

    const customerEmail = sanitizeEmail(donor.email) || undefined;
    const customerPhone = sanitizePhone(donor.phone) || undefined;
    if (!customerPhone) {
      return jsonResponse(400, { error: 'customer_phone_required' });
    }

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: donor.id || `cust_${orderId}`,
        customer_email: customerEmail,
        customer_phone: customerPhone
      },
      order_note: truncate(`${notes.note || notes.description || 'Donation'}`, 120)
    };

    const resp = await fetch(`${base}/pg/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secret,
        'x-api-version': apiVersion,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await resp.text();
    if (!resp.ok) {
      safeLog('ERROR', 'cf-create-order', {
        order_id: orderId,
        env,
        api_version: apiVersion,
        status: resp.status,
        body: shorten(text, 500)
      });
      return jsonResponse(502, { error: 'provider_error', status: resp.status, detail: tryParseJSON(text) || text });
    }

    const data = tryParseJSON(text) || {};
    safeLog('INFO', 'cf-create-order', { order_id: orderId, env, status: 'CREATED', amount, currency: 'INR' });

    return jsonResponse(200, {
      mode: env === 'PRODUCTION' ? 'production' : 'sandbox',
      order_id: data.order_id || orderId,
      payment_session_id: data.payment_session_id,
      order: data
    });
  } catch (e) {
    safeLog('ERROR', 'cf-create-order', { message: 'Unhandled error', detail: String(e && (e.stack || e)) });
    return jsonResponse(500, { error: 'server_error' });
  }
}

// ------------------------ Helpers ------------------------
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

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function truncate(s, max) {
  s = String(s || '');
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

function shorten(s, max) {
  if (typeof s !== 'string') return s;
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function tryParseJSON(s) {
  try { return JSON.parse(s); } catch { return null; }
}

function makeOrderId() {
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8);
  return `don-${ts}-${rand}`;
}

function sanitizeEmail(email) {
  if (!email) return '';
  const s = String(email).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : '';
}

function sanitizePhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) return '';
  return digits;
}