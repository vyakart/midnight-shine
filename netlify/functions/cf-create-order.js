// netlify/functions/cf-create-order.js
// Create Cashfree Order and return payment_session_id
// - Expects JSON body: { amount: number (rupees), currency: "INR", donor?: { id?, email?, phone? }, notes?: { note?, description? } }
// - Returns: { mode, order_id, payment_session_id, order }
// Security: never log secrets or PII. Logs are structured JSON per repo standards.

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return textResponse(405, 'Method Not Allowed');
  }

  try {
    const body = JSON.parse(event.body || '{}');

    // Inputs (UI may send amount or order_amount)
    const rawAmount = body.amount ?? body.order_amount ?? null;
    const currency = String(body.currency || body.order_currency || 'INR').toUpperCase();
    const donor = body.donor || {};
    const notes = body.notes || {};

    // Basic validation
    if (!isFinite(rawAmount) || Number(rawAmount) <= 0) {
      return jsonResponse(400, { error: 'Invalid amount' });
    }
    if (currency !== 'INR') {
      return jsonResponse(400, { error: 'Currency must be INR' });
    }

    // Cashfree expects rupees (decimal), not paise
    const amount = round2(Number(rawAmount));

    // Secrets / env
    const appId = process.env.CASHFREE_APP_ID;
    const secret = process.env.CASHFREE_SECRET_KEY;
    const env = String(process.env.CF_ENV || 'PRODUCTION').toUpperCase();
    const apiVersion = process.env.CF_API_VERSION || '2023-08-01';
    if (!appId || !secret) {
      safeLog('ERROR', 'cf-create-order', { message: 'Missing Cashfree credentials' });
      return jsonResponse(500, { error: 'Server not configured' });
    }

    // API base
    const base = env === 'PRODUCTION' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
    // Debug: which API base and version are used (no secrets)
    safeLog('INFO', 'cf-create-order.debug', { env, base, apiVersion });

    // Order id (idempotent per click if client supplies; else server-generated)
    const orderId = (body.order_id && String(body.order_id)) || makeOrderId();
 
    // Derive and validate customer details (avoid logging PII)
    const customerEmail = sanitizeEmail(donor.email) || undefined;
    const customerPhone = sanitizePhone(donor.phone) || undefined;
    if (!customerPhone) {
      // Provider (Cashfree v5) requires phone to start payment
      return jsonResponse(400, { error: 'customer_phone_required', message: 'Phone number is required to start payment.' });
    }
 
    // Construct payload (avoid logging PII)
    const payload = {
      order_id: orderId,
      order_amount: amount,          // rupees with up to 2 decimals
      order_currency: 'INR',
      customer_details: {
        customer_id: donor.id || `cust_${orderId}`,
        customer_email: customerEmail,
        customer_phone: customerPhone
      },
      order_note: truncate(`${notes.note || notes.description || 'Donation'}`, 120)
    };

    // Server-to-server: Create order
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
        base,
        status: resp.status,
        body: shorten(text, 500)
      });
      return jsonResponse(502, { error: 'Cashfree order failed', status: resp.status, detail: tryParseJSON(text) || text });
    }

    const data = tryParseJSON(text) || {};
    // Expected fields: data.order_id, data.order_amount, data.order_currency, data.payment_session_id, ...
    safeLog('INFO', 'cf-create-order', { order_id: orderId, env, status: 'created', amount, currency: 'INR' });

    return jsonResponse(200, {
      mode: env === 'PRODUCTION' ? 'production' : 'sandbox',
      order_id: data.order_id || orderId,
      payment_session_id: data.payment_session_id,
      order: data
    });
  } catch (e) {
    safeLog('ERROR', 'cf-create-order', { message: 'Unhandled error', detail: String(e && e.stack || e) });
    return jsonResponse(500, { error: 'Server error' });
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
    // Structured logs per repo standard, avoiding PII
    const log = {
      level,
      timestamp: new Date().toISOString(),
      module: moduleName,
      ...obj
    };
    console.log(JSON.stringify(log));
  } catch {
    // swallow
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
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
  const rand = Math.random().toString(36).slice(2, 8);
  return `don-${ts}-${rand}`;
}

function sanitizeEmail(email) {
  if (!email) return '';
  const s = String(email).trim();
  // very light validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : '';
}

function sanitizePhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  // Allow 10..14 digits
  if (digits.length < 10 || digits.length > 14) return '';
  return digits;
}