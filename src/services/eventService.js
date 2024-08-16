import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp, orderBy, limit } from 'firebase/firestore';


// Get the current user ID
const getUserId = () => {
    return auth.currentUser ? auth.currentUser.uid : null;
};

// Create an event associated with the current user
export const createEvent = async (event) => {
    const userId = getUserId();
    if (!userId) throw new Error('User is not authenticated');

    const eventWithUser = {
        ...event, userId, createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    }; // Associate event with user
    await addDoc(collection(db, 'events'), eventWithUser);
};

// Get events for the current user
export const getEvents = async (_page, itemsPerPage) => {
    const userId = getUserId();
    if (!userId) throw new Error('User is not authenticated');

    const eventsQuery = query(
        collection(db, 'events'),
        where('userId', '==', userId),
        orderBy('createdAt'),
        limit(itemsPerPage)
    );

    const eventsSnapshot = await getDocs(eventsQuery);

    // For pagination, you can calculate the start index and fetch the next set of documents
    let lastVisible = null;
    let paginatedEvents = [];

    if (!eventsSnapshot.empty) {
        lastVisible = eventsSnapshot.docs[eventsSnapshot.docs.length - 1];
        paginatedEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    const totalItemsQuery = query(collection(db, 'events'), where('userId', '==', userId));
    const totalItemsSnapshot = await getDocs(totalItemsQuery);

    return {
        data: paginatedEvents,
        totalItems: totalItemsSnapshot.size,
        lastVisible, // The last document fetched (to use for the next page)
    };

    // return eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getUserRole = async () => {
    const userId = getUserId();
    if (!userId) return null;

    const userDoc = doc(db, 'users', userId);  // Assumes you have a 'users' collection
    const userSnapshot = await getDoc(userDoc);

    return userSnapshot.exists() ? userSnapshot.data().role : null;
};


// Update an event by ID, ensuring it's associated with the current user
export const updateEvent = async (id, updatedEvent) => {
    const userId = getUserId();
    const userRole = await getUserRole(); // Fetch the user role
    if (!userId) throw new Error('User is not authenticated');

    const eventDoc = doc(db, 'events', id);
    const eventSnapshot = await getDoc(eventDoc);

    // Allow event update if the user is the owner or has the "admin" role
    if (eventSnapshot.exists() && (eventSnapshot.data().userId === userId || userRole === 'admin')) {
        // Filter out undefined fields in updatedEvent
        const validUpdatedEvent = Object.fromEntries(
            Object.entries(updatedEvent).filter(([, value]) => value !== undefined)
        );

        await updateDoc(eventDoc, {
            ...validUpdatedEvent,
            updatedAt: serverTimestamp(),
        });
        // await updateDoc(eventDoc, {
        //     ...updatedEvent,
        //     updatedAt: serverTimestamp() // Update updatedAt timestamp
        // });
    } else {
        throw new Error('Event not found or you do not have permission to edit it');
    }
};

// Delete an event by ID, ensuring it's associated with the current user
export const deleteEvent = async (id) => {
    const userId = getUserId();
    const userRole = await getUserRole(); // Fetch the user role
    if (!userId) throw new Error('User is not authenticated');

    const eventDoc = doc(db, 'events', id);
    const eventSnapshot = await getDoc(eventDoc);

    // Allow event deletion if the user is the owner or has the "admin" role
    if (eventSnapshot.exists() && (eventSnapshot.data().userId === userId || userRole === 'admin')) {
        await deleteDoc(eventDoc);
    } else {
        throw new Error('Event not found or you do not have permission to delete it');
    }
};


// Get upcoming events
export const getUpcomingEvents = async (limitCount = 10) => {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startDateString = startOfDay.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"

    const upcomingEventsQuery = query(
        collection(db, 'events'),
        where('date', '>=', startDateString),
        orderBy('date', 'asc'),
        limit(limitCount)
    );

    const upcomingEventsSnapshot = await getDocs(upcomingEventsQuery);

    return upcomingEventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().date) // Convert string date to JavaScript Date object
    }));
};

// Use Timestamp for dates instead of string
// export const getUpcomingEvents = async (limitCount= 10) => {
//     const currentDate = new Date();
//     const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
//     const startTimestamp = Timestamp.fromDate(startOfDay);

//     const upcomingEventsQuery = query(
//         collection(db, 'events'),
//         where('date', '>=', startTimestamp),
//         orderBy('date', 'asc'),
//         limit(limitCount)
//     );

//     const upcomingEventsSnapshot = await getDocs(upcomingEventsQuery);
//     console.log('Upcoming events raw data:', upcomingEventsSnapshot.docs.map(doc => doc.data()));

//     return upcomingEventsSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         // date: doc.data().date.toDate() // Convert Firestore Timestamp to JavaScript Date
//     }));
// };