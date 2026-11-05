import "leaflet/dist/leaflet.css";
import { useParams, Link } from "react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Filter,
  List,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Flag,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Card } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import type { WerfItem } from "../../domain/models.ts";
import { isItemOverdue } from "../../domain/itemRules.ts";
import { useProjectItems } from "../hooks/useWerfViews";
import { NewItemModal } from "../components/NewItemModal";
import { ProjectMap } from "../components/ProjectMap";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export function ProjectMapScreen() {
  const { projectId } = useParams<{ projectId: string }>();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItemLocation, setNewItemLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [isPlacementMode, setIsPlacementMode] = useState(false);

  const { project, items, sortedItems, changeStatus } = useProjectItems(projectId, statusFilter);
  const selectedItem = items.find((item) => item.itemId === selectedItemId) ?? null;

  const handleMapClick = (lat: number, lng: number) => {
    if (isPlacementMode) {
      setNewItemLocation({ lat, lng });
      setIsNewItemModalOpen(true);
      setIsPlacementMode(false);
    }
  };

  const handleItemClick = (item: WerfItem) => {
    setSelectedItemId(item.itemId);
  };

  const handleStatusChange = (itemId: string, newStatus: WerfItem["status"]) => {
    changeStatus(itemId, newStatus);
  };

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Project niet gevonden</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
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
              <p className="text-sm text-gray-500">Project</p>
              <h1 className="text-2xl font-semibold text-gray-900">{project.projectName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px] h-12">
                <Filter className="size-5 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle items</SelectItem>
                <SelectItem value="uit te voeren">Uit te voeren</SelectItem>
                <SelectItem value="in uitvoering">In uitvoering</SelectItem>
                <SelectItem value="voltooid">Voltooid</SelectItem>
                <SelectItem value="overdue">Te laat</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="lg"
              onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
            >
              <List className="size-5 mr-2" />
              {viewMode === "map" ? "Lijstweergave" : "Kaartweergave"}
            </Button>

            <Button
              size="lg"
              variant={isPlacementMode ? "default" : "outline"}
              onClick={() => {
                setIsPlacementMode(!isPlacementMode);
                setNewItemLocation(null);
              }}
            >
              <Plus className="size-5 mr-2" />
              {isPlacementMode ? "Annuleer plaatsing" : "Nieuwe pin"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area (70%) */}
        <div className={`${viewMode === "map" ? "w-[70%]" : "w-0"} relative transition-all overflow-hidden`}>
          {viewMode === "map" && (
            <ProjectMap
              items={sortedItems}
              center={
                items.length > 0
                  ? [
                      items.reduce((sum, item) => sum + item.latitude, 0) / items.length,
                      items.reduce((sum, item) => sum + item.longitude, 0) / items.length,
                    ]
                  : [51.0543, 3.7174]
              }
              onItemClick={handleItemClick}
              onMapClick={handleMapClick}
              isPlacementMode={isPlacementMode}
            />
          )}
        </div>

        {/* Side Panel (30%) */}
        <div className={`${viewMode === "map" ? "w-[30%]" : "w-full"} border-l border-gray-200 bg-gray-50 flex flex-col transition-all`}>
          <div className="p-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Items ({sortedItems.length})
            </h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {sortedItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="size-12 mx-auto mb-3 text-gray-300" />
                  <p>Geen items gevonden</p>
                </div>
              ) : (
                sortedItems.map((item) => {
                  const isOverdue = isItemOverdue(item);
                  const isSelected = selectedItem?.itemId === item.itemId;

                  return (
                    <Card
                      key={item.itemId}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow-md"
                      } ${isOverdue ? "border-l-4 border-l-red-500" : ""}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm line-clamp-2">{item.titel}</h3>
                          <Badge
                            variant={
                              item.prioriteit >= 4
                                ? "destructive"
                                : item.prioriteit === 3
                                ? "default"
                                : "secondary"
                            }
                            className="shrink-0"
                          >
                            <Flag className="size-3 mr-1" />
                            {item.prioriteit}
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-1">{item.adresLocatie}</p>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="size-3" />
                          {format(item.deadline, "dd MMM yyyy", { locale: nl })}
                          {isOverdue && (
                            <span className="text-red-600 font-medium flex items-center gap-1">
                              <AlertTriangle className="size-3" />
                              Te laat
                            </span>
                          )}
                        </div>

                        <Select
                          value={item.status}
                          onValueChange={(value) =>
                            handleStatusChange(item.itemId, value as WerfItem["status"])
                          }
                        >
                          <SelectTrigger className="w-full h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uit te voeren">
                              <div className="flex items-center gap-2">
                                <Clock className="size-4" />
                                Uit te voeren
                              </div>
                            </SelectItem>
                            <SelectItem value="in uitvoering">
                              <div className="flex items-center gap-2">
                                <Clock className="size-4 text-blue-500" />
                                In uitvoering
                              </div>
                            </SelectItem>
                            <SelectItem value="voltooid">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-green-500" />
                                Voltooid
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Item details when selected */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Categorie
                            </p>
                            <p>
                              {item.hoofdcategorie}
                              {item.subcategorie && ` > ${item.subcategorie}`}
                            </p>
                          </div>

                          {item.contactpersoon && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                                <User className="size-3" />
                                Contactpersoon
                              </p>
                              <p>{item.contactpersoon}</p>
                              {item.contactgegevens && (
                                <p className="text-xs text-gray-600 whitespace-pre-line">
                                  {item.contactgegevens}
                                </p>
                              )}
                            </div>
                          )}

                          {item.opmerking && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">
                                Opmerking
                              </p>
                              <p className="text-sm text-gray-700 whitespace-pre-line">
                                {item.opmerking}
                              </p>
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              GPS Locatie
                            </p>
                            <p className="text-xs font-mono text-gray-600">
                              {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* New Item Modal */}
      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={() => {
          setIsNewItemModalOpen(false);
          setNewItemLocation(null);
        }}
        projectId={projectId || ""}
        initialLocation={newItemLocation}
      />
    </div>
  );
}