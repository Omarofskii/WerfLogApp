import type { WerfItem } from "./models.ts";

export interface ItemFilters {
  projectId?: string;
  search?: string;
  category?: string;
  status?: string;
}

export function isItemOverdue(item: WerfItem, now = new Date()): boolean {
  return item.status !== "voltooid" && item.deadline < now;
}

export function filterItems(items: readonly WerfItem[], filters: ItemFilters = {}, now = new Date()): WerfItem[] {
  const search = (filters.search ?? "").toLowerCase();
  return items.filter((item) =>
    (filters.projectId === undefined || item.projectId === filters.projectId) &&
    (item.titel.toLowerCase().includes(search) || item.opmerking.toLowerCase().includes(search)) &&
    (!filters.category || filters.category === "all" || item.hoofdcategorie === filters.category) &&
    (!filters.status || filters.status === "all" ||
      (filters.status === "overdue" ? isItemOverdue(item, now) : item.status === filters.status))
  );
}

export function sortItemsByUrgency(items: readonly WerfItem[], now = new Date()): WerfItem[] {
  return [...items].sort((a, b) =>
    Number(isItemOverdue(b, now)) - Number(isItemOverdue(a, now)) ||
    a.deadline.getTime() - b.deadline.getTime()
  );
}

export function summarizeItems(items: readonly WerfItem[], now = new Date()) {
  return {
    total: items.length,
    open: items.filter((item) => item.status !== "voltooid").length,
    overdue: items.filter((item) => isItemOverdue(item, now)).length,
    completed: items.filter((item) => item.status === "voltooid").length,
  };
}
