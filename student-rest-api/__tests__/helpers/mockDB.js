/**
 * mockDB.js
 * Helpers to quickly set up and reset Sequelize model mock return values.
 * Import in test files to avoid repeating jest.fn() boilerplate.
 *
 * NOTE: Do NOT import models here directly — the models mock is applied
 * globally by jest.mock in each test file's setup. This file only provides
 * factory functions for fake Sequelize instances.
 */

/**
 * Reset all model mocks between tests.
 * Call this from a beforeEach in tests that need isolation.
 */
function resetAllMocks() {
  // Jest's clearAllMocks() in afterEach is sufficient for most cases.
  // This helper exists for explicit per-test resets.
  jest.clearAllMocks();
}

/**
 * Create a fake Sequelize model instance with toJSON/toWeb/getJWT/comparePassword.
 */
function makeAccountInstance(overrides = {}) {
  const base = {
    account_id: 1,
    account_title: 'Test Institute',
    account_email: 'test@example.com',
    account_phone: '9999999999',
    account_password: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', // sha1('password')
    account_image: null,
    status: 0,
    delete: 0,
    notificationToken: null,
    ...overrides,
  };

  return {
    ...base,
    toJSON: () => ({ ...base }),
    toWeb: () => ({ ...base }),
    getJWT: jest.fn().mockReturnValue('mock.jwt.token'),
    comparePassword: jest.fn().mockResolvedValue({ ...base, getJWT: jest.fn().mockReturnValue('mock.jwt.token'), toWeb: () => ({ ...base }) }),
  };
}

/**
 * Create a fake plan purchase instance.
 */
function makePlanInstance(overrides = {}) {
  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const past = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const base = {
    plan_purchase_id: 1,
    account_id: 1,
    plan_id: 1,
    plan_title: 'Pro Plan',
    plan_sdate: past,
    plan_edate: future,
    status: 0,
    delete: 0,
    ...overrides,
  };

  return {
    ...base,
    toJSON: () => ({ ...base, endDate: base.plan_edate, startDate: base.plan_sdate }),
  };
}

/**
 * Create a fake student instance.
 */
function makeStudentInstance(overrides = {}) {
  const base = {
    id: 10,
    first_name: 'Test',
    last_name: 'Student',
    phone: '8888888888',
    email: 'student@example.com',
    password: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
    status: 0,
    delete: 0,
    webDeviceId: 'test-web-device-id',
    androidDeviceId: null,
    ...overrides,
  };

  return {
    ...base,
    toJSON: () => ({ ...base }),
    getJWT: jest.fn().mockReturnValue('student.mock.jwt.token'),
  };
}

module.exports = {
  resetAllMocks,
  makeAccountInstance,
  makePlanInstance,
  makeStudentInstance,
};
