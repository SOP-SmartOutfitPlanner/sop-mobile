import { CollectionRecord } from "../../types/collection";

type CollectionUpdatePayload = {
  id: number;
  changes: Partial<CollectionRecord>;
};

type CollectionDeletePayload = {
  id: number;
};

type CollectionUpdateListener = (payload: CollectionUpdatePayload) => void;
type CollectionDeleteListener = (payload: CollectionDeletePayload) => void;

const updateListeners = new Set<CollectionUpdateListener>();
const deleteListeners = new Set<CollectionDeleteListener>();

export const emitCollectionUpdate = (
  id: number,
  changes: Partial<CollectionRecord>
) => {
  updateListeners.forEach((listener) => listener({ id, changes }));
};

export const subscribeToCollectionUpdates = (
  listener: CollectionUpdateListener
) => {
  updateListeners.add(listener);
  return () => {
    updateListeners.delete(listener);
  };
};

export const emitCollectionRecord = (record: CollectionRecord) => {
  emitCollectionUpdate(record.id, record);
};

export const emitCollectionDelete = (id: number) => {
  deleteListeners.forEach((listener) => listener({ id }));
};

export const subscribeToCollectionDeletes = (
  listener: CollectionDeleteListener
) => {
  deleteListeners.add(listener);
  return () => {
    deleteListeners.delete(listener);
  };
};

