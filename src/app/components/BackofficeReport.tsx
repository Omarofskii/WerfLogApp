import { CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import type { getBackofficeReport } from "../../application/queries.ts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const STATUS_COLORS = ["#3b82f6", "#f59e0b", "#10b981"];

export function BackofficeReport({ report }: { report: ReturnType<typeof getBackofficeReport> }) {
  const { total: totalItems, open: openItems, overdue: overdueItems, completed: completedItems } = report.summary;
  const { categoryData, priorityData } = report;
  const statusData = report.statusData.map((entry, index) => ({ ...entry, color: STATUS_COLORS[index] }));
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Totaal items</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <CheckCircle2 className="size-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{totalItems}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Open items</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <CheckCircle2 className="size-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600">{openItems}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Te laat</h3>
              <div className="bg-red-100 p-2 rounded-lg">
                <CheckCircle2 className="size-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">{overdueItems}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Voltooid</h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">{completedItems}</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Status verdeling</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Items per categorie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="items" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Prioriteit verdeling</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Project overzicht</h3>
            <div className="space-y-3">
              {report.projects.map((project) => {
                const projectOpen = project.open;
                const projectCompleted = project.completed;

                return (
                  <div
                    key={project.projectId}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium mb-2">{project.projectName}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-600">
                        {projectOpen} open
                      </span>
                      <span className="text-green-600">
                        {projectCompleted} voltooid
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Kanban-style view */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Rapport per status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Uit te voeren */}
            <div>
              <div className="bg-gray-100 p-3 rounded-lg mb-3">
                <h4 className="font-semibold">Uit te voeren</h4>
                <p className="text-sm text-gray-600">
                  {report.byStatus["uit te voeren"].length}{" "}
                  items
                </p>
              </div>
              <div className="space-y-2">
                {report.byStatus["uit te voeren"]
                  .slice(0, 5)
                  .map((item) => (
                    <Card key={item.itemId} className="p-3">
                      <p className="text-sm font-medium line-clamp-2">
                        {item.titel}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.hoofdcategorie}
                      </p>
                    </Card>
                  ))}
              </div>
            </div>

            {/* In uitvoering */}
            <div>
              <div className="bg-blue-100 p-3 rounded-lg mb-3">
                <h4 className="font-semibold">In uitvoering</h4>
                <p className="text-sm text-gray-600">
                  {report.byStatus["in uitvoering"].length}{" "}
                  items
                </p>
              </div>
              <div className="space-y-2">
                {report.byStatus["in uitvoering"]
                  .slice(0, 5)
                  .map((item) => (
                    <Card key={item.itemId} className="p-3">
                      <p className="text-sm font-medium line-clamp-2">
                        {item.titel}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.hoofdcategorie}
                      </p>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Voltooid */}
            <div>
              <div className="bg-green-100 p-3 rounded-lg mb-3">
                <h4 className="font-semibold">Voltooid</h4>
                <p className="text-sm text-gray-600">
                  {report.byStatus["voltooid"].length} items
                </p>
              </div>
              <div className="space-y-2">
                {report.byStatus["voltooid"]
                  .slice(0, 5)
                  .map((item) => (
                    <Card key={item.itemId} className="p-3">
                      <p className="text-sm font-medium line-clamp-2">
                        {item.titel}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.hoofdcategorie}
                      </p>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}
