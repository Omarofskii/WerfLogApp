import type { WerfRepository, WerfSnapshot } from "../application/WerfRepository.ts";
import type { Project, WerfItem } from "../domain/models.ts";

export class InMemoryWerfRepository implements WerfRepository {
  private snapshot: WerfSnapshot;
  private listeners = new Set<() => void>();

  constructor(projects: readonly Project[], items: readonly WerfItem[]) {
    this.snapshot = structuredClone({ projects, items });
  }

  getSnapshot = (): WerfSnapshot => this.snapshot;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  updateItemStatus(itemId: string, status: WerfItem["status"]): void {
    if (!this.snapshot.items.some((item) => item.itemId === itemId)) {
      throw new Error(`Item not found: ${itemId}`);
    }
    this.snapshot = {
      ...this.snapshot,
      items: this.snapshot.items.map((item) => item.itemId === itemId ? { ...item, status } : item),
    };
    this.listeners.forEach((listener) => listener());
  }
}
