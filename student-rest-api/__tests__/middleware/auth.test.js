/**
 * middleware/auth.test.js
 * Unit tests for passport JWT strategies and token parsing logic.
 * These tests validate the core auth middleware behaviour in isolation,
 * without spinning up a real HTTP server.
 */

const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

// Config is mocked globally by setup.js
const CONFIG = require('../../config/config');

// Helper: generate a valid JWT that matches the shape the passport strategy expects
function buildJWT(payload, options = {}) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    CONFIG.CRYPTOJS_ENCRYPTION_KEY
  ).toString();
  return jwt.sign(
    { token: encrypted },
    CONFIG.jwt_encryption,
    { expiresIn: options.expiresIn || '24h' }
  );
}

// Helper: generate an expired JWT
function buildExpiredJWT(payload) {
  return buildJWT(payload, { expiresIn: '-1s' });
}

// ==================================================================
// JWT token structure validation
// ==================================================================
describe('JWT token structure', () => {

  it('can be decoded with the correct secret', () => {
    const payload = { user_id: 1, userType: 1 };
    const token = buildJWT(payload);
    const decoded = jwt.verify(token, CONFIG.jwt_encryption);
    expect(decoded).toHaveProperty('token');
    expect(decoded).toHaveProperty('exp');
    expect(decoded).toHaveProperty('iat');
  });

  it('throws JsonWebTokenError with wrong secret', () => {
    const payload = { user_id: 1, userType: 1 };
    const token = buildJWT(payload);
    expect(() => jwt.verify(token, 'wrong_secret')).toThrow('invalid signature');
  });

  it('throws TokenExpiredError for an expired token', () => {
    const payload = { user_id: 42, userType: 1 };
    const expired = buildExpiredJWT(payload);
    expect(() => jwt.verify(expired, CONFIG.jwt_encryption)).toThrow('jwt expired');
  });

  it('throws JsonWebTokenError for a completely malformed token', () => {
    expect(() => jwt.verify('not.a.jwt', CONFIG.jwt_encryption)).toThrow();
  });

  it('throws JsonWebTokenError for an empty string', () => {
    expect(() => jwt.verify('', CONFIG.jwt_encryption)).toThrow();
  });
});

// ==================================================================
// Token expiry check logic (mirrors passport.js middleware logic)
// ==================================================================
describe('Token expiry check (passport strategy logic)', () => {

  function isTokenExpired(jwt_payload) {
    const exp = new Date(jwt_payload.exp * 1000);
    const currentTime = new Date();
    return (exp.getTime() - currentTime.getTime()) < 0;
  }

  it('returns false (not expired) for a future expiry time', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    expect(isTokenExpired({ exp: futureExp })).toBe(false);
  });

  it('returns true (expired) for a past expiry time', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    expect(isTokenExpired({ exp: pastExp })).toBe(true);
  });

  it('returns true when expiry is exactly 0ms in the past', () => {
    const justExpired = Math.floor(Date.now() / 1000) - 1;
    expect(isTokenExpired({ exp: justExpired })).toBe(true);
  });
});

// ==================================================================
// CryptoJS encrypted payload (mirrors passport inner token decrypt)
// ==================================================================
describe('CryptoJS payload encryption / decryption', () => {

  it('round-trips an institute payload correctly', () => {
    const data = { user_id: 5, userType: 1 };
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      CONFIG.CRYPTOJS_ENCRYPTION_KEY
    ).toString();

    const bytes = CryptoJS.AES.decrypt(ciphertext, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    expect(decrypted).toEqual(data);
  });

  it('round-trips a tutor payload correctly', () => {
    const data = { accountId: 10, id: 99, userType: 3 };
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      CONFIG.CRYPTOJS_ENCRYPTION_KEY
    ).toString();

    const bytes = CryptoJS.AES.decrypt(ciphertext, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    expect(decrypted).toEqual(data);
  });

  it('round-trips a student payload correctly', () => {
    const data = { id: 77, userType: 4 };
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      CONFIG.CRYPTOJS_ENCRYPTION_KEY
    ).toString();

    const bytes = CryptoJS.AES.decrypt(ciphertext, CONFIG.CRYPTOJS_ENCRYPTION_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    expect(decrypted).toEqual(data);
  });

  it('produces different ciphertexts for different payloads', () => {
    const ct1 = CryptoJS.AES.encrypt(JSON.stringify({ id: 1 }), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
    const ct2 = CryptoJS.AES.encrypt(JSON.stringify({ id: 2 }), CONFIG.CRYPTOJS_ENCRYPTION_KEY).toString();
    expect(ct1).not.toBe(ct2);
  });
});

// ==================================================================
// Bearer token extraction (mirrors ExtractJwt.fromAuthHeaderAsBearerToken)
// ==================================================================
describe('Bearer token extraction from Authorization header', () => {

  function extractBearerToken(authHeader) {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;
    return parts[1];
  }

  it('extracts token from valid Bearer header', () => {
    const token = 'abc.def.ghi';
    const result = extractBearerToken(`Bearer ${token}`);
    expect(result).toBe(token);
  });

  it('returns null when header is missing', () => {
    expect(extractBearerToken(undefined)).toBeNull();
  });

  it('returns null when header has wrong scheme', () => {
    expect(extractBearerToken('Basic abc123')).toBeNull();
  });

  it('returns null for a header with no space', () => {
    expect(extractBearerToken('BearerXXX')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractBearerToken('')).toBeNull();
  });
});

// ==================================================================
// Error handler middleware (middleware/errorHandler.js)
// ==================================================================
describe('Error handler middleware', () => {

  const errorHandler = require('../../middleware/errorHandler');

  function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  it('returns 401 for JsonWebTokenError', () => {
    const err = new Error('invalid signature');
    err.name = 'JsonWebTokenError';
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('returns 401 for TokenExpiredError', () => {
    const err = new Error('jwt expired');
    err.name = 'TokenExpiredError';
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 400 for validation type error', () => {
    const err = { type: 'validation', errors: [{ msg: 'email required' }] };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'Validation failed' })
    );
  });

  it('returns 500 for unknown errors', () => {
    const err = new Error('unexpected crash');
    const res = mockRes();
    errorHandler(err, { app: { get: () => 'test' } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('uses err.status when available', () => {
    const err = new Error('not found');
    err.status = 404;
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
