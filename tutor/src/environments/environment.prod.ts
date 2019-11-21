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
    // accessKeyId: 'AKIAXXXXXXXXEXAMPLE4',
    // secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',

    // accessKeyId: 'AKIAXXXXXXXXEXAMPLE2',
    // secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',

    accessKeyId: 'AKIAXXXXXXXXEXAMPLE1',
    secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',

    region: 'ap-south-1',
    bucket: 'toa-data', // Live
  },

  chatSocket : 'https://api.example.com',
  baseUrl: 'https://api.example.com/v1/', // Live
  encryptionKey:'YOUR_CRYPTO_SECRET_KEY',
  razorPayKey:'rzp_live_XXXXXXXXXXXXXX',
  importLiveClass: false,
  encryptDecryptResponse: true,
};