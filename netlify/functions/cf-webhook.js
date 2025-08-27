// netlify/functions/cf-webhook.js
// Fresh Cashfree webhook endpoint (Sandbox by default)
// - Verifies x-webhook-signature using CASHFREE_WEBHOOK_SECRET (HMAC-SHA256, base64)
// - Accepts POST with JSON body from Cashfree
// - Responds 200 on success (after verification), non-2xx on failure

import crypto from 'node:crypto';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return textResponse(405, 'Method Not Allowed');
  }

  const secret = process.env.CASHFREE_WEBHOOK_SECRET;
  if (!secret) {
    safeLog('ERROR', 'cf-webhook', { message: 'Missing CASHFREE_WEBHOOK_SECRET' });
    return textResponse(500, 'Server not configured');
  }

  // Obtain raw body as UTF-8 string for signature verification
  let rawBody = event.body || '';
  if (event.isBase64Encoded) {
    try {
      rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
    } catch {
      // If decode fails, continue with original string
    }
  }

  const sigHeader =
    event.headers['x-webhook-signature'] ||
    event.headers['X-Webhook-Signature'] ||
    event.headers['x-Webhook-Signature'] ||
    '';

  if (!sigHeader) {
    safeLog('WARN', 'cf-webhook', { message: 'Missing signature header' });
    return textResponse(400, 'Missing signature');
  }

  // Verify HMAC-SHA256 (base64)
  const ok = verifySignature(rawBody, sigHeader, secret);
  if (!ok) {
    safeLog('WARN', 'cf-webhook', { message: 'Invalid signature' });
    return textResponse(400, 'Invalid signature');
  }

  // Signature verified; now parse and process event safely
  let payload = {};
  try {
    payload = JSON.parse(rawBody || '{}');
  } catch {
    safeLog('WARN', 'cf-webhook', { message: 'Invalid JSON payload' });
    return textResponse(400, 'Invalid JSON');
  }

  // Extract minimal fields (avoid logging PII)
  const orderId = String(payload?.data?.order?.order_id || payload?.order_id || '');
  const eventType = String(payload?.type || payload?.event || '');
  const orderStatus = String(payload?.data?.order?.order_status || payload?.order_status || '');
  const amount = payload?.data?.order?.order_amount ?? payload?.order_amount ?? null;
  const currency = payload?.data?.order?.order_currency ?? payload?.order_currency ?? null;

  safeLog('INFO', 'cf-webhook', {
    order_id: orderId || undefined,
    event: eventType || undefined,
    status: orderStatus || undefined,
    amount: amount ?? undefined,
    currency: currency ?? undefined,
    verified: true
  });

  // Optional TODO: reconcile with GET /pg/orders/{order_id} (idempotent), or persist to DB/logs.

  return textResponse(200, 'ok');
}

/* ------------------------ Helpers ------------------------ */
function verifySignature(rawBody, signatureBase64, secret) {
  try {
    const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
    // timingSafeEqual requires equal length buffers
    const a = Buffer.from(hmac, 'utf8');
    const b = Buffer.from(signatureBase64, 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
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