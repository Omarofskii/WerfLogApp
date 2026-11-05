import { Link } from "react-router";
import { Search, Filter, Building2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useProjects } from "../hooks/useWerfViews";
import { useState } from "react";

export function ProjectsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredProjects = useProjects(searchQuery, showActiveOnly);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold text-gray-900">Werflog</h1>
            <Link to="/backoffice">
              <Button variant="outline" size="lg">
                Backoffice
              </Button>
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder="Zoek projecten..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={showActiveOnly ? "default" : "outline"}
              size="lg"
              className="px-6"
              onClick={() => setShowActiveOnly(!showActiveOnly)}
            >
              <Filter className="size-5 mr-2" />
              {showActiveOnly ? "Alle projecten" : "Actieve projecten"}
            </Button>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Building2 className="size-16 mb-4 text-gray-300" />
              <p className="text-lg">Geen projecten gevonden</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProjects.map((project) => {
                const openItems = project.open;
                const overdueItems = project.overdue;

                return (
                  <Link key={project.projectId} to={`/project/${project.projectId}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Building2 className="size-7 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                            {project.projectName}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Open items</span>
                          <Badge
                            variant={openItems > 0 ? "default" : "secondary"}
                            className="text-base px-3 py-1"
                          >
                            <CheckCircle2 className="size-4 mr-1" />
                            {openItems}
                          </Badge>
                        </div>
                        
                        {overdueItems > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Te laat</span>
                            <Badge
                              variant="destructive"
                              className="text-base px-3 py-1"
                            >
                              <AlertCircle className="size-4 mr-1" />
                              {overdueItems}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <Button className="w-full mt-4 h-12 text-base" size="lg">
                        Open project
                      </Button>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
