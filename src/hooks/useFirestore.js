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
    await addDoc(collection(db, 'entries'), {
      ...entry,
      userId,
      createdAt: new Date().toISOString()
    });
  };

  const updateEntry = async (id, entry) => {
    const docRef = doc(db, 'entries', id);
    await updateDoc(docRef, {
      ...entry,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteEntry = async (id) => {
    const docRef = doc(db, 'entries', id);
    await deleteDoc(docRef);
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry };
}
