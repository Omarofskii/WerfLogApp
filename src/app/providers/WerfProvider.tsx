import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { WerfRepository } from "../../application/WerfRepository.ts";
import { changeItemStatus } from "../../application/commands.ts";
import type { WerfItem } from "../../domain/models.ts";

const WerfContext = createContext<WerfRepository | null>(null);

export function WerfProvider({ repository, children }: { repository: WerfRepository; children: ReactNode }) {
  return <WerfContext.Provider value={repository}>{children}</WerfContext.Provider>;
}

export function useWerfData() {
  const repository = useContext(WerfContext);
  if (!repository) throw new Error("useWerfData requires WerfProvider");
  const snapshot = useSyncExternalStore(repository.subscribe, repository.getSnapshot);
  return {
    ...snapshot,
    changeStatus: (itemId: string, status: WerfItem["status"]) => changeItemStatus(repository, itemId, status),
  };
}
