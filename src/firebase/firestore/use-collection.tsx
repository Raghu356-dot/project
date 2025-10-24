'use client';
import {
  collection,
  onSnapshot,
  query,
  Query,
  where,
  WhereFilterOp,
  orderBy,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
  QueryConstraint,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';

import { useFirestore } from '../provider';

type CollectionQuery<T> = {
  path: string;
  queryConstraints?: QueryConstraint[];
  listen?: boolean;
};

export type UseCollectionOptions = {
  listen?: boolean;
  queryConstraints?: QueryConstraint[];
};

type UseCollectionHookResult<T> = {
  data: (T & { id: string })[] | null;
  loading: boolean;
  error: Error | null;
};

export function useCollection<T>(
  path: string,
  options?: UseCollectionOptions
): UseCollectionHookResult<T> {
  const firestore = useFirestore();
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedQuery = useMemo(() => {
    if (!firestore) return null;
    const constraints = options?.queryConstraints || [];
    return query(collection(firestore, path), ...constraints);
  }, [firestore, path, options?.queryConstraints]);

  useEffect(() => {
    if (!memoizedQuery) {
      if (!firestore) {
        setLoading(false);
      }
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T & { id: string })
        );
        setData(docs);
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
  }, [memoizedQuery, firestore]);

  return { data, loading, error };
}
