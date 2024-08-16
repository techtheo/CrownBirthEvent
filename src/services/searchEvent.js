import { query, collection, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';



export const searchEvents = async (searchTerm, itemsPerPage) => {
    const eventsQuery = query(
        collection(db, 'events'),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name'),
        limit(itemsPerPage)
    );

    const eventSnapshot = await getDocs(eventsQuery);
    const events = eventSnapshot.docs.map(doc => doc.data());

    return events;
};