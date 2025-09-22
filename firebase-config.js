// Firebase configuration and initialization
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZlD7jwY-JHh8I_kRBl4l8j8WnY8OBQ0Y",
  authDomain: "q9-website.firebaseapp.com",
  projectId: "q9-website",
  storageBucket: "q9-website.firebasestorage.app",
  messagingSenderId: "104604911651",
  appId: "1:104604911651:web:146baed1388cf9df1dc996",
  measurementId: "G-R11EE4G5JP"
};

// Initialize Firebase (Compatibility mode)
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();

// Enable offline persistence for Firestore
db.enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Multiple tabs open, persistence disabled');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the features required for persistence
      console.log('Browser does not support persistence');
    }
  });
