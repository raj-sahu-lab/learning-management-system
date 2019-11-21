export const environment = {
  production: true,

  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'companyapp.firebaseapp.com',
    databaseURL: 'https://companyapp.firebaseio.com',
    projectId: 'companyapp',
    storageBucket: 'companyapp.appspot.com',
    messagingSenderId: '991466856987',
    appId: '1:991466856987:web:0cf380330faded52e50ebe',
    measurementId: 'G-C13GZHD33N'
  },

  aws: {
    accessKeyId: 'AKIAXXXXXXXXEXAMPLE1',
    secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
    region: 'ap-south-1',
    bucket: 'edtech-platformdevelopment', // Developer
  },

  chatSocket : 'http://api.learnonapp.in:5000',
  // baseUrl: 'https://api.example.com/v1/', // Live
  baseUrl: 'http://api.learnonapp.in:5000/v1/', // Developer
  // baseUrl: 'http://localhost:5000/v1/', // Check API in local
  encryptionKey:'YOUR_CRYPTO_SECRET_KEY',
  razorPayKey:'rzp_test_XXXXXXXXXXXXXX',
  importLiveClass: true,
  encryptDecryptResponse: true, //Dev-False,Live-True
};