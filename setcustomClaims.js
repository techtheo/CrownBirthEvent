const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Set custom user claims
admin.auth().setCustomUserClaims('p6cciVqdwUPSCLdYWd6B84U2r443', { role: 'admin' })
  .then(() => {
    console.log('Custom claims set successfully');
  })
  .catch((error) => {
    console.error('Error setting custom claims:', error);
  });
