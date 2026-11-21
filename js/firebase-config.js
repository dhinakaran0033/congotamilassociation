// Firebase web-app config (not secret; access is controlled by the security rules in FIREBASE_SETUP.md).
export const firebaseConfig = {
  apiKey: "AIzaSyA-0BVxCp8W-x86tNd4eDXT4vMMv-wuOuI",
  authDomain: "congotamil.firebaseapp.com",
  projectId: "congotamil",
  storageBucket: "congotamil.firebasestorage.app",
  messagingSenderId: "1093452264168",
  appId: "1:1093452264168:web:2cf1620e71ca8664fbcf5d"
};

// GitHub repo where uploaded PDFs/images are committed (branch that GitHub Pages publishes).
export const GITHUB = { owner: 'dhinakaran0033', repo: 'congotamilassociation', branch: 'main' };

// The ONE account allowed to add/delete books (the user you create in Firebase Authentication).
// Must match the email used in the security rules.
export const ADMIN_EMAIL = 'test@congotamil.com';
