/**
 * auth.test.js
 * Integration tests for the Institute authentication endpoints.
 * Uses supertest against a test Express app with all DB/external-service mocks in place.
 */

// Setup file is loaded via jest.config.js setupFilesAfterFramework, but we also
// explicitly require the mock DB helpers here to control per-test state.
const { makeAccountInstance, makePlanInstance } = require('./helpers/mockDB');

// ------------------------------------------------------------------
// Mock heavy services before the app (and its require tree) is loaded
// ------------------------------------------------------------------

// Mock util.service so AWS S3 / SIB / SMTP calls are never made
jest.mock('../services/V1/util.service', () => ({
  to: async (promise) => {
    try {
      const result = await promise;
      return [null, result];
    } catch (err) {
      return [err];
    }
  },
  toWithout: async (promise) => {
    try {
      const result = await promise;
      return [null, result];
    } catch (err) {
      return [err];
    }
  },
  ReE: (res, err, code) => {
    const msg = typeof err === 'object' && err.message ? err.message : err;
    const status = code || 422;
    res.status(status).json({ success: false, error: msg });
  },
  ReS: (res, message, data, code) => {
    const status = code || 200;
    res.status(status).json({ success: true, message, data });
  },
  ReS1: (res, message, data) => {
    res.status(200).json({ success: true, message, data });
  },
  TE: (msg) => { throw new Error(msg); },
  UploadImage: jest.fn().mockResolvedValue({ Location: 'https://s3.example.com/img.jpg' }),
  GetSignUrl: jest.fn().mockResolvedValue('https://signed.example.com/img.jpg'),
  DeleteFromBucket: jest.fn().mockResolvedValue(true),
  RegisterForMailing: jest.fn().mockResolvedValue({ id: 1 }),
  SendMailUsingTOA: jest.fn().mockResolvedValue(true),
  SendOtpEmail: jest.fn().mockResolvedValue(true),
  RegisterInstituteInSIB: jest.fn().mockResolvedValue(true),
  InstituteFolderInSIB: jest.fn().mockResolvedValue(true),
  SendInstituteRegisterEMail: jest.fn().mockResolvedValue(true),
  SendTextMessage: jest.fn().mockResolvedValue(true),
}));

// Mock Institute auth service
jest.mock('../services/V1/Institute/auth.service', () => ({
  authUser: jest.fn(),
  checkPlan: jest.fn(),
  addLoginEntry: jest.fn().mockResolvedValue({ id: 1 }),
  updateUser: jest.fn().mockResolvedValue([1]),
  storeLogedDevice: jest.fn().mockResolvedValue(true),
  getUser: jest.fn(),
  getUserObj: jest.fn(),
  userExist: jest.fn(),
  getLastInvoice: jest.fn(),
  addNewPlan: jest.fn(),
}));

// Mock Tutor auth service (also pulled in by user.controller)
jest.mock('../services/V1/Tutor/Authentication.service', () => ({
  checkLogin: jest.fn().mockResolvedValue(null),
}));

// Mock plan/menu/createsubdomain services
jest.mock('../services/V1/Superadmin/plan.service', () => ({
  getPlanList: jest.fn().mockResolvedValue([]),
}));
jest.mock('../services/V1/Superadmin/MenuManagment.service', () => ({
  getMenuList: jest.fn().mockResolvedValue([]),
}));
jest.mock('../services/V1/createsubdomain.service', () => ({
  createSubDomain: jest.fn().mockResolvedValue({ domain: 'test.example.com' }),
}));

// Mock CronJob controller (it registers cron tasks on require)
jest.mock('../controllers/V1/CronJob.controller', () => ({}));

// Mock notification service (requires a Firebase credentials JSON file at runtime)
jest.mock('../services/V1/notification.service', () => ({
  sendPushNotification: jest.fn().mockResolvedValue(true),
  sendNotificationToTopic: jest.fn().mockResolvedValue(true),
}));

// Mock all other controller-level services that pull in Firebase or other credentials
jest.mock('../services/V1/aws.services.js', () => ({
  uploadToS3: jest.fn().mockResolvedValue({ Location: 'https://s3.example.com/file.jpg' }),
  deleteFromS3: jest.fn().mockResolvedValue(true),
}));

// Note: We do NOT import routes/v1.js in this test file. Instead, we build a
// minimal test app (see buildTestApp below) that mounts only the user controller
// endpoints. This avoids needing to mock all ~20 controllers referenced in v1.js.

// Mock ChargeBee service
jest.mock('../services/V1/ChargeBee.service', () => ({
  GetChargeBeePayURL: jest.fn().mockResolvedValue('https://chargebee.example.com/checkout'),
}));

// ------------------------------------------------------------------
// Import app AFTER mocks are in place
// ------------------------------------------------------------------
const request = require('supertest');
const authService = require('../services/V1/Institute/auth.service');

// Build a focused test app that mounts ONLY user controller routes.
// This avoids importing the full v1.js (which references ~20 controllers and
// would require mocking every single exported handler function).
const express = require('express');
const passport = require('passport');

function buildTestApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    req.fields = req.body || {};
    next();
  });
  app.use(passport.initialize());

  // Set up passport strategies (uses mocked models + config)
  require('../middleware/passport')(passport);

  // Import only the validators and controller we are testing
  const {
    institutionLoginValidation,
    forgotPasswordValidation,
  } = require('../middleware/validators/authValidator');
  const UserController = require('../controllers/V1/Institute/user.controller');

  // Mount a minimal router that mirrors v1.js for user-related endpoints
  const router = express.Router();
  router.get('/', (req, res) => res.json({ status: true, data: { version_number: 'v1.0.0' } }));
  router.post('/user/login', institutionLoginValidation, UserController.login);
  router.get('/user/logout', passport.authenticate('jwt', { session: false }), UserController.logout);
  router.get('/user', passport.authenticate('jwt', { session: false }), UserController.getUser);
  router.post('/user/forGotPassword', forgotPasswordValidation, UserController.forGotPasswordReset);

  app.use('/v1/institute', router);

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ success: false, error: err.message });
  });
  return app;
}

let app;

beforeAll(() => {
  app = buildTestApp();
});

afterEach(() => {
  jest.clearAllMocks();
});

// ==================================================================
// POST /v1/institute/user/login
// ==================================================================
describe('POST /v1/institute/user/login', () => {

  it('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/v1/institute/user/login')
      .send({ password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(app)
      .post('/v1/institute/user/login')
      .send({ email: 'admin@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when email is invalid format', async () => {
    const res = await request(app)
      .post('/v1/institute/user/login')
      .send({ email: 'not-an-email', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app)
      .post('/v1/institute/user/login')
      .send({ email: 'admin@example.com', password: 'abc' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 422 on invalid credentials (authUser throws)', async () => {
    authService.authUser.mockRejectedValue(new Error('Invalid Credentials. Please try again.'));

    // The controller checks body.phone, body.password, body.deviceId for its own validation
    // BEFORE calling authService. We must satisfy those checks to reach the service call.
    const res = await request(app)
      .post('/v1/institute/user/login')
      .send({
        email: 'wrong@example.com', // satisfies express-validator
        phone: 'wrong@example.com', // satisfies controller's phone check
        password: 'wrongpassword',
        deviceId: 'device-001',
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('returns 402 when user has no active plan', async () => {
    const mockAccount = makeAccountInstance();
    authService.authUser.mockResolvedValue(mockAccount);
    authService.checkPlan.mockResolvedValue(null); // no plan

    const res = await request(app)
      .post('/v1/institute/user/login')
      .send({
        email: 'admin@example.com',
        phone: 'admin@example.com',
        password: 'password123',
        deviceId: 'device-001',
      });

    expect(res.status).toBe(402);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/plan/i);
  });

  it('returns 402 when plan is expired', async () => {
    const mockAccount = makeAccountInstance();
    const expiredPlan = makePlanInstance({
      plan_edate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    });
    authService.authUser.mockResolvedValue(mockAccount);
    authService.checkPlan.mockResolvedValue(expiredPlan);

    const res = await request(app)
      .post('/v1/institute/user/login')
      .send({
        email: 'admin@example.com',
        phone: 'admin@example.com',
        password: 'password123',
        deviceId: 'device-001',
      });

    expect(res.status).toBe(402);
    expect(res.body.message).toMatch(/expire/i);
  });

  it('returns 200 with bearer_token on valid credentials and active plan', async () => {
    const mockAccount = makeAccountInstance();
    const activePlan = makePlanInstance();
    authService.authUser.mockResolvedValue(mockAccount);
    authService.checkPlan.mockResolvedValue(activePlan);
    authService.addLoginEntry.mockResolvedValue({ id: 1 });
    authService.storeLogedDevice.mockResolvedValue(true);

    const res = await request(app)
      .post('/v1/institute/user/login')
      .send({
        email: 'admin@example.com',
        phone: 'admin@example.com',
        password: 'password123',
        deviceId: 'device-001',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('bearer_token');
  });
});

// ==================================================================
// GET /v1/institute/user (protected route — requires valid JWT)
// ==================================================================
describe('GET /v1/institute/user (protected)', () => {

  it('returns 401 when no Authorization header is provided', async () => {
    const res = await request(app)
      .get('/v1/institute/user');

    expect(res.status).toBe(401);
  });

  it('returns 401 when Authorization header has malformed token', async () => {
    const res = await request(app)
      .get('/v1/institute/user')
      .set('Authorization', 'Bearer this.is.not.valid');

    expect(res.status).toBe(401);
  });
});

// ==================================================================
// POST /v1/institute/user/forGotPassword
// ==================================================================
describe('POST /v1/institute/user/forGotPassword', () => {

  it('returns 400 when email field is missing', async () => {
    const res = await request(app)
      .post('/v1/institute/user/forGotPassword')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when email is not a valid email', async () => {
    const res = await request(app)
      .post('/v1/institute/user/forGotPassword')
      .send({ email: 'not-valid' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ==================================================================
// GET /v1/institute/ (public health check)
// ==================================================================
describe('GET /v1/institute/', () => {

  it('returns 200 with API version info', async () => {
    const res = await request(app)
      .get('/v1/institute/');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body.data).toHaveProperty('version_number');
  });
});
