// Set test environment before anything loads
process.env.NODE_ENV = 'test';
process.env.JWT_ENCRYPTION = 'test_jwt_secret_for_testing_32chars!!';
process.env.CRYPTOJS_ENCRYPTION_KEY = 'test_cryptojs_key_for_testing';
process.env.WEBSITE_ENCRYPTION_KEY = 'test_website_key_for_testing';
process.env.STUDENT_ENCRYPTION_KEY = 'test_student_key_for_testing';
process.env.PORT = '5001';
process.env.APP = 'test';

// Mock config module so no DB connection is attempted on import
jest.mock('../config/config', () => ({
  app: 'test',
  port: '5001',
  db_dialect: 'mysql',
  db_host: 'localhost',
  db_port: '3306',
  db_name: 'test_db',
  db_user: 'root',
  db_password: 'test',
  jwt_encryption: 'test_jwt_secret_for_testing_32chars!!',
  jwt_expiration: '24h',
  CRYPTOJS_ENCRYPTION_KEY: 'test_cryptojs_key_for_testing',
  WEBSITE_ENCRYPTION_KEY: 'test_website_key_for_testing',
  STUDENT_ENCRYPTION_KEY: 'test_student_key_for_testing',
  accessKeyId: 'test_access_key',
  secretAccessKey: 'test_secret_key',
  AWS_REGION: 'ap-south-1',
  bucket: 'test-bucket',
  cloud_front: '',
  cloud_front_url: '',
  cloud_front_public_key: '',
  emailAttatchmentsbucket: 'test-email-bucket',
  ZoomAPIKey: 'test_zoom_key',
  ZoomAPISecret: 'test_zoom_secret',
  TwilioAccountSid: 'test_twilio_sid',
  TwilioAuthToken: 'test_twilio_token',
  TwilioNumber: '+10000000000',
  instituteDomain: 'test.example.com',
  Student_Panel: 'https://student.example.com/',
  chargebeesite: 'test-site',
  chargebeeapikey: 'test_chargebee_key',
  CHARGEBEE_URL: 'https://test.chargebee.com',
  CHARGEBEE_API_KEY: 'test_chargebee_api_key',
  STATCI_FILES: '',
  SMTP_UserEmail: 'test@example.com',
  SMTP_UserPassword: 'test_pass',
  SMTP_Host: 'smtp.example.com',
  SMTP_Port: '587',
}));

// Mock the models/index.js (Sequelize) to avoid real DB connections
jest.mock('../models', () => {
  const mockSequelize = {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    define: jest.fn(),
    query: jest.fn(),
  };
  return {
    sequelize: mockSequelize,
    Sequelize: { Op: { or: Symbol('or'), and: Symbol('and'), like: Symbol('like') } },
    TOA_account: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    TOA_student: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    TOA_Admin: {
      findOne: jest.fn(),
      findByPk: jest.fn(),
    },
    TOA_branch: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    },
    TOA_plan_purchase: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
    },
    TOA_login_device: {
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    },
    TOA_account_log: {
      create: jest.fn(),
    },
    TOA_student_institute_relationship: {
      findOne: jest.fn(),
    },
    TOA_city: { findAll: jest.fn() },
    TOA_country: { findAll: jest.fn() },
    TOA_currency: { findAll: jest.fn() },
    TOA_term: { findAll: jest.fn() },
    TOA_plan: { findAll: jest.fn() },
    TOA_plan_detail: { findAll: jest.fn() },
    TOA_offer: { findAll: jest.fn() },
  };
});
