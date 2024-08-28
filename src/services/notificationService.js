// src/services/notificationService.js
import { getMessaging, getToken, send } from 'firebase/messaging';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const messaging = getMessaging();

export const sendNotification = async (userId, message) => {
  try {
    const userToken = await getUserToken(userId); // Ensure this function fetches the correct FCM token

    if (!userToken) {
      throw new Error('User token not found');
    }

    await messaging.send({
      token: userToken,
      notification: {
        title: 'Booking Status Update',
        body: message,
      },
    });

    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Function to fetch user FCM token from Firestore
const getUserToken = async (userId) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', userId); // Adjust the path based on your Firestore schema
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data().fcmToken; // Ensure this field exists and contains the FCM token
  } else {
    console.error('No such user!');
    return null;
  }
};
