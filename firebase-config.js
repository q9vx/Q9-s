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
  window.firebaseError = error;
}

// ---------------------------------------------------------------------
// App Check — verifies requests are coming from your real site before
// Firestore accepts them. Uses the same reCAPTCHA Enterprise key.
// Safely deferred on localhost/file: so local testing is never blocked.
// ---------------------------------------------------------------------
try {
  const isLocalEnv = typeof location !== 'undefined' && (
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.protocol === 'file:'
  );

  // App Check only initializes in production or when not local
  if (firebaseApp && firebase.appCheck && !isLocalEnv) {
    const appCheck = firebase.appCheck();
    appCheck.activate(
      new firebase.appCheck.ReCaptchaEnterpriseProvider('6LfenNErAAAAAN8PVNwE5GoWnlcTDj5Xvhbi6HqW'),
      true // auto-refresh the App Check token
    );
    console.log('✅ App Check activated in production mode');
  } else if (isLocalEnv) {
    console.log('ℹ️ Local development detected — App Check bypassed for local testing.');
  }
} catch (error) {
  console.warn('App Check initialization note:', error);
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

// Export for use in other scripts
window.firebaseServices = {
  app: firebaseApp,
  db: db,
  auth: auth
};