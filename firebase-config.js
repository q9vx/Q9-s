// Secure Firebase Configuration with Enhanced Error Handling
const firebaseConfig = {
  apiKey: "AIzaSyDZlD7jwY-JHh8I_kRBl4l8j8WnY8OBQ0Y",
  authDomain: "q9-website.firebaseapp.com",
  projectId: "q9-website",
  storageBucket: "q9-website.firebasestorage.app",
  messagingSenderId: "104604911651",
  appId: "1:104604911651:web:146baed1388cf9df1dc996",
  measurementId: "G-R11EE4G5JP"
};

// Initialize Firebase with comprehensive error handling
let firebaseApp;
try {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // Fallback for graceful degradation
  window.firebaseError = error;
}

// Initialize services with enhanced error handling
let db, auth;
try {
  if (firebaseApp) {
    db = firebase.firestore();
    auth = firebase.auth();
    console.log('✅ Firebase services initialized');
  }
} catch (error) {
  console.error('❌ Firebase services initialization failed:', error);
}

// Enable offline persistence with enhanced error handling
if (db) {
  db.enablePersistence()
    .then(() => {
      console.log('✅ Offline persistence enabled');
    })
    .catch((err) => {
      if (err.code == 'failed-precondition') {
        console.log('ℹ️ Multiple tabs open, persistence disabled');
      } else if (err.code == 'unimplemented') {
        console.log('ℹ️ Browser does not support persistence');
      } else {
        console.error('❌ Persistence error:', err);
      }
    });
}

// Export for use in other scripts
window.firebaseServices = {
  app: firebaseApp,
  db: db,
  auth: auth
};
