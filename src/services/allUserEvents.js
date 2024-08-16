import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { getUserDetails } from './authService';

// Get events for all users (for admin view)
export const getAllEventsWithUserDetails = async (_page, itemsPerPage) => {
    const eventsQuery = query(
        collection(db, 'events'),
        orderBy('createdAt'),
        limit(itemsPerPage)
    );

    const eventsSnapshot = await getDocs(eventsQuery);

    let lastVisible = null;
    let paginatedEvents = [];

    if (!eventsSnapshot.empty) {
        lastVisible = eventsSnapshot.docs[eventsSnapshot.docs.length - 1];

        paginatedEvents = await Promise.all(eventsSnapshot.docs.map(async (doc) => {
            const eventData = doc.data();
            const userDoc = await getUserDetails(eventData.userId);
            return {
                id: doc.id,
                ...eventData,
                userName: userDoc.name,
                userEmail: userDoc.email,
            };
        }));
    }

    const totalItemsQuery = query(collection(db, 'events'));
    const totalItemsSnapshot = await getDocs(totalItemsQuery);

    return {
        data: paginatedEvents,
        totalItems: totalItemsSnapshot.size,
        lastVisible,
    };
};