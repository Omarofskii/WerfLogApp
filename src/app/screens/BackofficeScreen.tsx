import { Link } from "react-router";
import { useState } from "react";
import { ArrowLeft, Search, Filter, MapPin, Download, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { mockWerfItems, mockProjects, HOOFDCATEGORIEEN } from "../data/mockData";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function BackofficeScreen() {
  const [activeTab, setActiveTab] = useState("lijst");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setHoofdcategorieFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Filter items
  const filteredItems = mockWerfItems.filter((item) => {
    const matchesSearch =
      item.titel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.opmerking.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.hoofdcategorie === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalItems = mockWerfItems.length;
  const openItems = mockWerfItems.filter((i) => i.status !== "voltooid").length;
  const overdueItems = mockWerfItems.filter(
    (i) => i.status !== "voltooid" && i.deadline < new Date()
  ).length;
  const completedItems = mockWerfItems.filter((i) => i.status === "voltooid").length;

  // Data for charts
  const statusData = [
    { name: "Uit te voeren", value: mockWerfItems.filter((i) => i.status === "uit te voeren").length, color: "#3b82f6" },
    { name: "In uitvoering", value: mockWerfItems.filter((i) => i.status === "in uitvoering").length, color: "#f59e0b" },
    { name: "Voltooid", value: mockWerfItems.filter((i) => i.status === "voltooid").length, color: "#10b981" },
  ];

  const categoryData = HOOFDCATEGORIEEN.map((cat) => ({
    name: cat,
    items: mockWerfItems.filter((i) => i.hoofdcategorie === cat).length,
  }));

  const priorityData = [
    { name: "Prioriteit 1", value: mockWerfItems.filter((i) => i.prioriteit === 1).length },
    { name: "Prioriteit 2", value: mockWerfItems.filter((i) => i.prioriteit === 2).length },
    { name: "Prioriteit 3", value: mockWerfItems.filter((i) => i.prioriteit === 3).length },
    { name: "Prioriteit 4", value: mockWerfItems.filter((i) => i.prioriteit === 4).length },
    { name: "Prioriteit 5", value: mockWerfItems.filter((i) => i.prioriteit === 5).length },
  ];

  // Status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "voltooid":
        return "secondary";
      case "in uitvoering":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="lg">
                <ArrowLeft className="size-5 mr-2" />
                Terug
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Backoffice</h1>
              <p className="text-sm text-gray-500">Beheer en rapportage</p>
            </div>
          </div>

          <Button variant="outline" size="lg">
            <Download className="size-5 mr-2" />
            Export
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6">
            <TabsList className="h-14">
              <TabsTrigger value="lijst" className="text-base px-6">
                Lijst
              </TabsTrigger>
              <TabsTrigger value="rapportering" className="text-base px-6">
                Rapportering
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Lijst Tab */}
          <TabsContent value="lijst" className="flex-1 mt-0 overflow-hidden">
            <div className="h-full flex">
              {/* Filters Sidebar */}
              <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6 overflow-y-auto">
                <div>
                  <h3 className="font-semibold mb-3">Filters</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tekstzoek
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          placeholder="Zoek in titel of opmerking..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Hoofdcategorie
                      </label>
                      <Select value={categoryFilter} onValueChange={setHoofdcategorieFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle categorieën</SelectItem>
                          {HOOFDCATEGORIEEN.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Status
                      </label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle statussen</SelectItem>
                          <SelectItem value="uit te voeren">Uit te voeren</SelectItem>
                          <SelectItem value="in uitvoering">In uitvoering</SelectItem>
                          <SelectItem value="voltooid">Voltooid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSearchQuery("");
                        setHoofdcategorieFilter("all");
                        setStatusFilter("all");
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-3">Samenvatting</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Totaal items:</span>
                      <span className="font-semibold">{totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Open:</span>
                      <span className="font-semibold text-blue-600">{openItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Te laat:</span>
                      <span className="font-semibold text-red-600">{overdueItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voltooid:</span>
                      <span className="font-semibold text-green-600">{completedItems}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto p-6">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead>Titel</TableHead>
                          <TableHead>Categorie</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead className="w-[80px]">Prioriteit</TableHead>
                          <TableHead>Contactpersoon</TableHead>
                          <TableHead>Project</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                              Geen items gevonden
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredItems.map((item) => {
                            const isOverdue =
                              item.status !== "voltooid" && item.deadline < new Date();
                            const project = mockProjects.find(
                              (p) => p.projectId === item.projectId
                            );

                            return (
                              <TableRow
                                key={item.itemId}
                                className={`cursor-pointer ${
                                  selectedItem === item.itemId ? "bg-blue-50" : ""
                                } ${isOverdue ? "bg-red-50" : ""}`}
                                onClick={() => setSelectedItem(item.itemId)}
                              >
                                <TableCell>
                                  <Badge variant={getStatusVariant(item.status)}>
                                    {item.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {item.titel}
                                  {isOverdue && (
                                    <Badge variant="destructive" className="ml-2 text-xs">
                                      Te laat
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {item.hoofdcategorie}
                                  {item.subcategorie && (
                                    <span className="text-gray-500">
                                      {" "}
                                      &gt; {item.subcategorie}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {format(item.deadline, "dd MMM yyyy", { locale: nl })}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      item.prioriteit >= 4
                                        ? "destructive"
                                        : item.prioriteit === 3
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {item.prioriteit}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {item.contactpersoon || "-"}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {project?.projectName}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Detail Panel for selected item */}
                {selectedItem && (
                  <div className="border-t border-gray-200 bg-white p-6">
                    {(() => {
                      const item = mockWerfItems.find((i) => i.itemId === selectedItem);
                      if (!item) return null;

                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">{item.titel}</h3>
                            <Link to={`/project/${item.projectId}`}>
                              <Button variant="outline" size="sm">
                                <MapPin className="size-4 mr-2" />
                                Open op kaart
                              </Button>
                            </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Adres:</span>
                              <p>{item.adresLocatie || "-"}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Contactpersoon:</span>
                              <p>{item.contactpersoon || "-"}</p>
                            </div>
                          </div>
                          {item.opmerking && (
                            <div>
                              <span className="text-gray-600 text-sm">Opmerking:</span>
                              <p className="text-sm mt-1">{item.opmerking}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Rapportering Tab */}
          <TabsContent value="rapportering" className="flex-1 mt-0 overflow-auto">
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
                      {mockProjects.map((project) => {
                        const projectItems = mockWerfItems.filter(
                          (i) => i.projectId === project.projectId
                        );
                        const projectOpen = projectItems.filter(
                          (i) => i.status !== "voltooid"
                        ).length;
                        const projectCompleted = projectItems.filter(
                          (i) => i.status === "voltooid"
                        ).length;

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
                          {mockWerfItems.filter((i) => i.status === "uit te voeren").length}{" "}
                          items
                        </p>
                      </div>
                      <div className="space-y-2">
                        {mockWerfItems
                          .filter((i) => i.status === "uit te voeren")
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
                          {mockWerfItems.filter((i) => i.status === "in uitvoering").length}{" "}
                          items
                        </p>
                      </div>
                      <div className="space-y-2">
                        {mockWerfItems
                          .filter((i) => i.status === "in uitvoering")
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
                          {mockWerfItems.filter((i) => i.status === "voltooid").length} items
                        </p>
                      </div>
                      <div className="space-y-2">
                        {mockWerfItems
                          .filter((i) => i.status === "voltooid")
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
