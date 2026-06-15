require('dotenv').config();//instatiate environment variables
//require('dotenv').config({path: '../.env'});
let CONFIG = {} //Make this global to use all over the application



CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '5000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'name';
CONFIG.db_user = process.env.DB_USER || 'app_user';
CONFIG.db_password = process.env.DB_PASSWORD || '';

if (!process.env.JWT_ENCRYPTION && process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_ENCRYPTION environment variable is required in production');
    process.exit(1);
}
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_dev_secret_change_in_production';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '5h';

if (!process.env.CRYPTOJS_ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
    console.error('FATAL: CRYPTOJS_ENCRYPTION_KEY environment variable is required in production');
    process.exit(1);
}
CONFIG.CRYPTOJS_ENCRYPTION_KEY = process.env.CRYPTOJS_ENCRYPTION_KEY || 'dev_crypto_key_change_in_production';
CONFIG.WEBSITE_ENCRYPTION_KEY = process.env.WEBSITE_ENCRYPTION_KEY || '';
CONFIG.STUDENT_ENCRYPTION_KEY = process.env.STUDENT_ENCRYPTION_KEY || '';


CONFIG.SMTP_UserEmail = process.env.SMTP_UserEmail
CONFIG.SMTP_UserPassword = process.env.SMTP_UserPassword
CONFIG.SMTP_Host = process.env.SMTP_Host
CONFIG.SMTP_Port = process.env.SMTP_Port


CONFIG.accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'accessKeyId';
CONFIG.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'secretAccessKey';
CONFIG.AWS_REGION = process.env.AWS_REGION || 'ap-south-1.';
CONFIG.bucket = process.env.BUCKET || 'toa-images';
CONFIG.cloud_front = process.env.CLOUDFRONT || '';
CONFIG.cloud_front_url = process.env.CLOUDFRONTURL || '';
CONFIG.cloud_front_public_key = process.env.CLOUDFRONTPUBLICKEY || '';
CONFIG.emailAttatchmentsbucket = process.env.EMAILATTATCHMENTSBUCKET || 'email-attachments-bucket';

CONFIG.ZoomAPIKey = process.env.ZoomAPIKey;
CONFIG.ZoomAPISecret = process.env.ZoomAPISecret;

CONFIG.TwilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
CONFIG.TwilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
CONFIG.TwilioNumber = process.env.TWILIO_NUMBER || '';

CONFIG.instituteDomain = process.env.INSTITUTE_DOMAIN || '';
CONFIG.Student_Panel = process.env.Student_Panel || 'https://student.example.com/';
CONFIG.elasticTranscode = process.env.elasticTranscode;

// chargebee
CONFIG.chargebeesite = process.env.CHARGEBEESITE || 'naymio-test';
CONFIG.chargebeeapikey = process.env.CHARGEBEEAPIKEY || 'YOUR_CHARGEBEE_API_KEY';
CONFIG.STATCI_FILES = process.env.STATCI_FILES || '';

CONFIG.CHARGEBEE_URL= process.env.CHARGEBEE_URL || '';
CONFIG.CHARGEBEE_API_KEY= process.env.CHARGEBEE_API_KEY || '';
module.exports = CONFIG;
