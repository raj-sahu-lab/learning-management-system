/**
 * validation.test.js
 * Unit tests for express-validator middleware chains defined in
 * middleware/validators/authValidator.js and
 * middleware/validators/instituteValidator.js.
 *
 * Strategy: simulate express-validator's request lifecycle by running
 * each validator array against a mock req/res/next triple, then checking
 * whether handleValidation would pass or block.
 */

const { validationResult } = require('express-validator');

// Run an array of express-validator middleware against a mock request body.
async function runValidators(middlewareChain, body) {
  // Build a minimal Express-like request
  const req = {
    body,
    // express-formidable stores fields here; validators key off body by default
    // but the handleValidation step uses validationResult(req)
    query: {},
    params: {},
    headers: {},
    cookies: {},
  };
  const res = {};
  let blockingError = null;

  // Run every middleware in the chain except the last (handleValidation does res.json)
  for (const mw of middlewareChain) {
    await new Promise((resolve) => {
      // Capture calls to res.status().json() to detect early rejection
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn((body) => {
        if (body && body.success === false) blockingError = body;
        resolve();
      });
      const next = resolve;
      mw(req, res, next);
    });
    if (blockingError) break;
  }

  const errors = validationResult(req);
  return { errors: errors.array(), blocked: !!blockingError, blockingError };
}

// ==================================================================
// authValidator — institutionLoginValidation
// ==================================================================
const {
  institutionLoginValidation,
  adminLoginValidation,
  studentLoginValidation,
  studentRegisterValidation,
  forgotPasswordValidation,
  sendOTPValidation,
  verifyOTPValidation,
} = require('../middleware/validators/authValidator');

describe('institutionLoginValidation', () => {

  it('passes for valid email and password', async () => {
    const { errors } = await runValidators(institutionLoginValidation, {
      email: 'admin@example.com',
      password: 'securePass1',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails when email is missing', async () => {
    const { errors } = await runValidators(institutionLoginValidation, {
      password: 'securePass1',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toBe('email');
  });

  it('fails when email is not a valid email address', async () => {
    const { errors } = await runValidators(institutionLoginValidation, {
      email: 'not-an-email',
      password: 'securePass1',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toBe('email');
  });

  it('fails when password is shorter than 6 characters', async () => {
    const { errors } = await runValidators(institutionLoginValidation, {
      email: 'admin@example.com',
      password: 'abc',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toBe('password');
  });

  it('fails when both email and password are missing', async () => {
    const { errors } = await runValidators(institutionLoginValidation, {});
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});

// ==================================================================
// forgotPasswordValidation
// ==================================================================
describe('forgotPasswordValidation', () => {

  it('passes for a valid email', async () => {
    const { errors } = await runValidators(forgotPasswordValidation, {
      email: 'user@example.com',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails when email is missing', async () => {
    const { errors } = await runValidators(forgotPasswordValidation, {});
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when email is not a valid format', async () => {
    const { errors } = await runValidators(forgotPasswordValidation, {
      email: 'plainaddress',
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});

// ==================================================================
// studentRegisterValidation
// ==================================================================
describe('studentRegisterValidation', () => {

  it('passes for valid registration data', async () => {
    const { errors } = await runValidators(studentRegisterValidation, {
      email: 'student@example.com',
      password: 'strongPass8',
      name: 'John Doe',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails when password is less than 8 characters', async () => {
    const { errors } = await runValidators(studentRegisterValidation, {
      email: 'student@example.com',
      password: 'short',
      name: 'John',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toBe('password');
  });

  it('fails when name is a single character', async () => {
    const { errors } = await runValidators(studentRegisterValidation, {
      email: 'student@example.com',
      password: 'strongPass8',
      name: 'J',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toBe('name');
  });

  it('fails when all fields are missing', async () => {
    const { errors } = await runValidators(studentRegisterValidation, {});
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});

// ==================================================================
// verifyOTPValidation
// ==================================================================
describe('verifyOTPValidation', () => {

  it('passes when email and otp are provided', async () => {
    const { errors } = await runValidators(verifyOTPValidation, {
      email: 'user@example.com',
      otp: '123456',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails when otp is missing', async () => {
    const { errors } = await runValidators(verifyOTPValidation, {
      email: 'user@example.com',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.path === 'otp')).toBe(true);
  });

  it('fails when email is invalid and otp is missing', async () => {
    const { errors } = await runValidators(verifyOTPValidation, {
      email: 'bad',
    });
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});

// ==================================================================
// instituteValidator — newInstituteValidation
// ==================================================================
const {
  newInstituteValidation,
  addBranchValidation,
  addLearnerValidation,
  addCouponValidation,
  sendNotificationValidation,
} = require('../middleware/validators/instituteValidator');

describe('newInstituteValidation', () => {

  it('passes for valid institute data', async () => {
    const { errors } = await runValidators(newInstituteValidation, {
      name: 'Bright Academy',
      email: 'admin@brightacademy.com',
      password: 'supersecure1',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails when name is a single character', async () => {
    const { errors } = await runValidators(newInstituteValidation, {
      name: 'A',
      email: 'admin@brightacademy.com',
      password: 'supersecure1',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toBe('name');
  });

  it('fails when email is missing', async () => {
    const { errors } = await runValidators(newInstituteValidation, {
      name: 'Academy',
      password: 'supersecure1',
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});

// ==================================================================
// addCouponValidation
// ==================================================================
describe('addCouponValidation', () => {

  it('passes for a valid coupon', async () => {
    const { errors } = await runValidators(addCouponValidation, {
      code: 'SAVE20',
      discount: 20,
    });
    expect(errors).toHaveLength(0);
  });

  it('fails when discount is not a number', async () => {
    const { errors } = await runValidators(addCouponValidation, {
      code: 'SAVE20',
      discount: 'twenty',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toBe('discount');
  });

  it('fails when code is missing', async () => {
    const { errors } = await runValidators(addCouponValidation, {
      discount: 10,
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});

// ==================================================================
// sendNotificationValidation
// ==================================================================
describe('sendNotificationValidation', () => {

  it('passes for valid notification data', async () => {
    const { errors } = await runValidators(sendNotificationValidation, {
      title: 'New Update',
      message: 'A new course has been added',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails when title is too short', async () => {
    const { errors } = await runValidators(sendNotificationValidation, {
      title: 'X',
      message: 'A new course has been added',
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toBe('title');
  });

  it('fails when both fields are missing', async () => {
    const { errors } = await runValidators(sendNotificationValidation, {});
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});
