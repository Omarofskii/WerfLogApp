import type { WerfSnapshot } from "./WerfRepository.ts";
import { HOOFDCATEGORIEEN } from "../domain/categories.ts";
import { filterItems, summarizeItems } from "../domain/itemRules.ts";

export function getProjectSummaries(snapshot: WerfSnapshot, now = new Date()) {
  return snapshot.projects.map((project) => ({
    ...project,
    ...summarizeItems(filterItems(snapshot.items, { projectId: project.projectId }), now),
  }));
}

export function getVisibleProjects(snapshot: WerfSnapshot, search: string, activeOnly: boolean, now = new Date()) {
  return getProjectSummaries(snapshot, now).filter((project) =>
    project.projectName.toLowerCase().includes(search.toLowerCase()) && (!activeOnly || project.open > 0)
  );
}

export function getBackofficeReport(snapshot: WerfSnapshot, now = new Date()) {
  const items = snapshot.items;
  const byStatus = {
    "uit te voeren": filterItems(items, { status: "uit te voeren" }),
    "in uitvoering": filterItems(items, { status: "in uitvoering" }),
    voltooid: filterItems(items, { status: "voltooid" }),
  };
  return {
    summary: summarizeItems(items, now),
    projects: getProjectSummaries(snapshot, now),
    byStatus,
    statusData: [
      { name: "Uit te voeren", value: byStatus["uit te voeren"].length },
      { name: "In uitvoering", value: byStatus["in uitvoering"].length },
      { name: "Voltooid", value: byStatus.voltooid.length },
    ],
    categoryData: HOOFDCATEGORIEEN.map((name) => ({ name, items: filterItems(items, { category: name }).length })),
    priorityData: [1, 2, 3, 4, 5].map((priority) => ({
      name: `Prioriteit ${priority}`, value: items.filter((item) => item.prioriteit === priority).length,
    })),
  };
}
