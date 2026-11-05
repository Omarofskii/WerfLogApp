import type { WerfRepository } from "./WerfRepository.ts";
import type { WerfItem } from "../domain/models.ts";

export function changeItemStatus(repository: WerfRepository, itemId: string, status: WerfItem["status"]): void {
  if (!["uit te voeren", "in uitvoering", "voltooid"].includes(status)) {
    throw new Error(`Invalid item status: ${status}`);
  }
  repository.updateItemStatus(itemId, status);
}
