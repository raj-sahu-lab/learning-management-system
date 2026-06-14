/**
 * utils.test.js
 * Unit tests for utility functions in services/V1/util.service.js.
 * Only pure/mockable functions are covered here — AWS/SMTP functions
 * are integration-only and excluded.
 */

// util.service requires config (mocked by setup.js) and aws-sdk.
// We stub the aws-sdk so S3 calls never reach the network.
jest.mock('aws-sdk', () => {
  const mockS3 = {
    upload: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({ Location: 'https://s3.example.com/file.jpg', Key: 'test/file.jpg' }) }),
    deleteObject: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
    getSignedUrl: jest.fn().mockReturnValue('https://signed.example.com/file.jpg'),
  };
  return {
    config: { update: jest.fn() },
    S3: jest.fn(() => mockS3),
    CloudFront: jest.fn(() => ({})),
  };
});

// Stub SIB SDK
jest.mock('sib-api-v3-sdk', () => ({
  ApiClient: { instance: { authentications: { 'api-key': {} } } },
  ContactsApi: jest.fn(() => ({ createContact: jest.fn().mockResolvedValue({ id: 1 }) })),
  CreateContact: jest.fn(() => ({})),
  TransactionalEmailsApi: jest.fn(() => ({ sendTransacEmail: jest.fn().mockResolvedValue({}) })),
  SendSmtpEmail: jest.fn(() => ({})),
}));

// Stub nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  })),
}));

// Stub firebase-admin (pulled in by some util paths)
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  messaging: jest.fn(() => ({ send: jest.fn().mockResolvedValue('msg-id') })),
}));

const utilService = require('../services/V1/util.service');

// ==================================================================
// to() — async error/result tuple
// ==================================================================
describe('utilService.to()', () => {

  it('returns [null, result] on a resolved promise', async () => {
    const [err, res] = await utilService.to(Promise.resolve('hello'));
    expect(err).toBeNull();
    expect(res).toBe('hello');
  });

  it('returns [error] on a rejected promise', async () => {
    const [err, res] = await utilService.to(Promise.reject(new Error('oops')));
    expect(err).toBeTruthy();
    expect(res).toBeUndefined();
  });

  it('handles resolving with undefined', async () => {
    const [err, res] = await utilService.to(Promise.resolve(undefined));
    expect(err).toBeNull();
    expect(res).toBeUndefined();
  });

  it('handles resolving with null', async () => {
    const [err, res] = await utilService.to(Promise.resolve(null));
    expect(err).toBeNull();
    expect(res).toBeNull();
  });
});

// ==================================================================
// toWithout() — same shape but no parse-error wrapping
// ==================================================================
describe('utilService.toWithout()', () => {

  it('returns [null, result] on success', async () => {
    const [err, res] = await utilService.toWithout(Promise.resolve(42));
    expect(err).toBeNull();
    expect(res).toBe(42);
  });

  it('returns [err] on failure', async () => {
    const [err] = await utilService.toWithout(Promise.reject(new Error('fail')));
    expect(err).toBeInstanceOf(Error);
  });
});

// ==================================================================
// ReE() — Error Response helper
// ==================================================================
describe('utilService.ReE()', () => {

  function mockRes(baseUrl = '/v1/institute') {
    const res = {
      statusCode: 200,
      req: { baseUrl },
    };
    res.setHeader = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn((body) => body);
    return res;
  }

  it('sets statusCode and returns success:false JSON', () => {
    const res = mockRes();
    utilService.ReE(res, 'Something went wrong', 422);
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    expect(res.statusCode).toBe(422);
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(false);
    expect(body.error).toBe('Something went wrong');
  });

  it('extracts message from Error objects', () => {
    const res = mockRes();
    const err = new Error('DB connection failed');
    utilService.ReE(res, err, 500);
    const body = res.json.mock.calls[0][0];
    expect(body.error).toBe('DB connection failed');
  });

  it('includes data field when data argument is provided', () => {
    const res = mockRes();
    utilService.ReE(res, 'Error', 422, { field: 'phone' });
    const body = res.json.mock.calls[0][0];
    expect(body.data).toEqual({ field: 'phone' });
  });
});

// ==================================================================
// ReS() — Success Response helper (non-encrypted path)
// ==================================================================
describe('utilService.ReS()', () => {

  function mockRes(baseUrl = '/v1/student') {
    const res = {
      statusCode: 200,
      req: { baseUrl },
    };
    res.setHeader = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn((body) => body);
    return res;
  }

  it('returns success:true with message and data', () => {
    const res = mockRes();
    utilService.ReS(res, 'Created', { id: 5 });
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.message).toBe('Created');
    expect(body.data).toEqual({ id: 5 });
  });

  it('sets custom status code when provided', () => {
    const res = mockRes();
    utilService.ReS(res, 'Plan Expired', {}, 402);
    expect(res.statusCode).toBe(402);
  });
});

// ==================================================================
// ReS1() — Simple success response (no encryption)
// ==================================================================
describe('utilService.ReS1()', () => {

  it('always returns plain JSON regardless of baseUrl', () => {
    const res = {
      req: { baseUrl: '/v1/website' },
      json: jest.fn((body) => body),
    };
    utilService.ReS1(res, 'OK', { items: [] });
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.message).toBe('OK');
  });
});

// ==================================================================
// TE() — Throw Error helper
// ==================================================================
describe('utilService.TE()', () => {

  it('throws a standard Error with the given message', () => {
    expect(() => utilService.TE('Validation failed')).toThrow('Validation failed');
  });

  it('throws an instance of Error', () => {
    expect(() => utilService.TE('oops')).toThrow(Error);
  });
});

// ==================================================================
// currentDateFormat() global helper
// ==================================================================
describe('global.currentDateFormat()', () => {

  it('is registered as a global function after util.service loads', () => {
    expect(typeof global.currentDateFormat).toBe('function');
  });

  it('returns a non-empty string for a common format', () => {
    const result = global.currentDateFormat('yyyy-mm-dd');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns a result matching the date format pattern dd/mm/yyyy', () => {
    const result = global.currentDateFormat('dd/mm/yyyy');
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});
