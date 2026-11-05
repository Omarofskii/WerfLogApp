import type { Project, WerfItem } from "../domain/models.ts";

/** Synchronous, session-scoped storage contract. Snapshots must be stable until a write. */
export interface WerfSnapshot {
  readonly projects: readonly Project[];
  readonly items: readonly WerfItem[];
}

export interface WerfRepository {
  getSnapshot(): WerfSnapshot;
  subscribe(listener: () => void): () => void;
  updateItemStatus(itemId: string, status: WerfItem["status"]): void;
}
