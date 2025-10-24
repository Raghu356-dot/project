'use client';
import {
  doc,
  onSnapshot,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';

import { useFirestore } from '../provider';

export type UseDocOptions = {
  listen?: boolean;
};

type UseDocHookResult<T> = {
  data: (T & { id: string }) | null;
  loading: boolean;
  error: Error | null;
};

export function useDoc<T>(
  path: string,
  options?: UseDocOptions
): UseDocHookResult<T> {
  const firestore = useFirestore();
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedDocRef = useMemo(() => {
    if (!firestore || !path) return null;
    // Simple path splitting, assuming format like 'collection/docId'
    const parts = path.split('/');
    if (parts.length % 2 !== 0) {
      console.error('Invalid document path provided to useDoc:', path);
      return null;
    }
    return doc(firestore, path);
  }, [firestore, path]);

  useEffect(() => {
    if (!memoizedDocRef) {
      if (!firestore) {
        setLoading(false);
      }
      return;
    }

    setLoading(true);

    if (options?.listen) {
      const unsubscribe = onSnapshot(
        memoizedDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setData({
              id: snapshot.id,
              ...snapshot.data(),
            } as T & { id: string });
          } else {
            setData(null);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(err);
          setError(err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      getDoc(memoizedDocRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setData({
              id: snapshot.id,
              ...snapshot.data(),
            } as T & { id: string });
          } else {
            setData(null);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
          setLoading(false);
        });
    }
  }, [memoizedDocRef, firestore, options?.listen]);

  return { data, loading, error };
}
