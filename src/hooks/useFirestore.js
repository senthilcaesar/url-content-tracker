import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  where
} from 'firebase/firestore';

const getTodayDateString = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const toCreatedAtIso = (dateString) => {
  if (typeof dateString !== 'string' || !dateString) {
    return new Date().toISOString();
  }

  const parsedDate = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString();
  }

  return parsedDate.toISOString();
};

export function useFirestore(userId) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'entries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const addEntry = async (entry) => {
    if (!userId) return;

    const createdDate = entry.createdDate || getTodayDateString();

    await addDoc(collection(db, 'entries'), {
      ...entry,
      userId,
      createdDate,
      createdAt: toCreatedAtIso(createdDate)
    });
  };

  const updateEntry = async (id, entry) => {
    const docRef = doc(db, 'entries', id);
    const updatePayload = {
      ...entry,
      updatedAt: new Date().toISOString()
    };

    if (Object.prototype.hasOwnProperty.call(entry, 'createdDate')) {
      updatePayload.createdDate = entry.createdDate || getTodayDateString();
      updatePayload.createdAt = toCreatedAtIso(updatePayload.createdDate);
    }

    await updateDoc(docRef, updatePayload);
  };

  const deleteEntry = async (id) => {
    const docRef = doc(db, 'entries', id);
    await deleteDoc(docRef);
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry };
}
