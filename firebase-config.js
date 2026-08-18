// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyBdI8gCftplFOZ61lT6z80mjaicF3jcx08",
  authDomain: "ecologie-reading.firebaseapp.com",
  databaseURL: "https://ecologie-reading-default-rtdb.firebaseio.com",
  projectId: "ecologie-reading",
  storageBucket: "ecologie-reading.firebasestorage.app",
  messagingSenderId: "226971236181",
  appId: "1:226971236181:web:fd286018f3cf78a85ba1dc",
  measurementId: "G-5LFPMM6BBP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
