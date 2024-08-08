import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const eventsCollection = collection(db, 'events');

export const createEvent = async (event) => {
    await addDoc(eventsCollection, event);
};

export const getEvents = async () => {
    const eventsSnapshot = await getDocs(eventsCollection);
    return eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateEvent = async (id, updatedEvent) => {
    const eventDoc = doc(db, 'events', id);
    await updateDoc(eventDoc, updatedEvent);
};

export const deleteEvent = async (id) => {
    const eventDoc = doc(db, 'events', id);
    await deleteDoc(eventDoc);
};
