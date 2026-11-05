import { useWerfData } from "../providers/WerfProvider";
import { getVisibleProjects, getBackofficeReport } from "../../application/queries.ts";
import { filterItems, sortItemsByUrgency, type ItemFilters } from "../../domain/itemRules.ts";

export function useProjects(search: string, activeOnly: boolean) {
  return getVisibleProjects(useWerfData(), search, activeOnly);
}

export function useProjectItems(projectId: string | undefined, status: string) {
  const { projects, items, changeStatus } = useWerfData();
  const project = projects.find((project) => project.projectId === projectId);
  const projectItems = projectId ? filterItems(items, { projectId }) : [];
  const now = new Date();
  return {
    project,
    items: projectItems,
    sortedItems: sortItemsByUrgency(filterItems(projectItems, { status }, now), now),
    changeStatus,
  };
}

export function useBackoffice(filters: ItemFilters) {
  const snapshot = useWerfData();
  return {
    ...snapshot,
    filteredItems: filterItems(snapshot.items, filters),
    report: getBackofficeReport(snapshot),
  };
}
