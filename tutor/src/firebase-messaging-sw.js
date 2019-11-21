importScripts('https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.20.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "companyapp.firebaseapp.com",
  databaseURL: "https://companyapp.firebaseio.com",
  projectId: "companyapp",
  storageBucket: "companyapp.appspot.com",
  messagingSenderId: "991466856987",
  appId: "1:991466856987:web:0cf380330faded52e50ebe",
  measurementId: "G-C13GZHD33N"
});

const messaging = firebase.messaging();