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


// importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
// import { environment } from './environments/environment';

// firebase.initializeApp({
//    apiKey: environment.firebase.apiKey,
//    authDomain: environment.firebase.authDomain,
//    databaseURL: environment.firebase.databaseURL,
//    projectId: environment.firebase.projectId,
//    storageBucket: environment.firebase.storageBucket,
//    messagingSenderId: environment.firebase.messagingSenderId,
//    appId: environment.firebase.appId,
//    measurementId: environment.firebase.measurementId
// });

// const messaging = firebase.messaging();
