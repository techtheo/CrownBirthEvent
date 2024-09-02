const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.setCustomUserClaims = functions.https.onCall(async (data, context) => {
  // Ensure only authenticated users with the admin role can call this function
  if (!context.auth || !context.auth.token.admin) {
    return {error: "Only admins can set custom claims."};
  }

  // Validate input
  if (!data.uid || !data.role) {
    return {error: "Missing UID or role."};
  }

  try {
    await admin.auth().setCustomUserClaims(data.uid, {role: data.role});
    return {
      message: `Successfully assigned ${data.role} role to user ${data.uid}.`,
    };
  } catch (error) {
    return {
      error: `Failed to set custom claims: ${error.message}`,
    };
  }
});
