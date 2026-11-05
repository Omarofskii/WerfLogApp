import { X, Calendar as CalendarIcon, MapPin, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { HOOFDCATEGORIEEN } from "../../domain/categories.ts";
import type { WerfItem } from "../../domain/models.ts";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useNewItemForm } from "../hooks/useNewItemForm";

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  initialLocation: { lat: number; lng: number } | null;
}


export function NewItemModal({
  isOpen,
  onClose,
  projectId,
  initialLocation,
}: NewItemModalProps) {
  const {
    step,
    setStep,
    currentDate,
    gpsLocation,
    hoofdcategorie,
    setHoofdcategorie,
    subcategorie,
    setSubcategorie,
    status,
    setStatus,
    adresLocatie,
    setAdresLocatie,
    titel,
    setTitel,
    contactpersoon,
    setContactpersoon,
    contactgegevens,
    setContactgegevens,
    opmerking,
    setOpmerking,
    deadline,
    setDeadline,
    prioriteit,
    setPrioriteit,
    errors,
    availableSubcategorieen,
    requiresSubcategorie,
    handleStep1Next,
    handleStep2Save,
    handleClose
  } = useNewItemForm({ isOpen, onClose, initialLocation });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1 ? "Nieuw item - Categorieselectie" : "Nieuw item - Details"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Selecteer de hoofd- en subcategorie voor het nieuwe item" 
              : "Vul de details in voor het nieuwe item"}
          </DialogDescription>
        </DialogHeader>

        {/* Read-only info bar */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="size-4 text-gray-500" />
            <span className="font-medium">Datum:</span>
            <span>{format(currentDate, "dd MMMM yyyy", { locale: nl })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-gray-500" />
            <span className="font-medium">GPS:</span>
            {gpsLocation ? (
              <span className="font-mono text-xs">
                {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
              </span>
            ) : (
              <span className="text-gray-400">Locatie ophalen...</span>
            )}
          </div>
          {step === 2 && hoofdcategorie && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Categorie:</span>
              <Badge variant="secondary">
                {hoofdcategorie}
                {subcategorie && ` > ${subcategorie}`}
              </Badge>
            </div>
          )}
        </div>

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="hoofdcategorie" className="text-base">
                Hoofdcategorie *
              </Label>
              <Select value={hoofdcategorie} onValueChange={(value) => { setHoofdcategorie(value); setSubcategorie(""); }}>
                <SelectTrigger
                  id="hoofdcategorie"
                  className={`h-12 ${errors.hoofdcategorie ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Selecteer hoofdcategorie..." />
                </SelectTrigger>
                <SelectContent>
                  {HOOFDCATEGORIEEN.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.hoofdcategorie && (
                <p className="text-sm text-red-600">{errors.hoofdcategorie}</p>
              )}
            </div>

            {requiresSubcategorie && (
              <div className="space-y-2">
                <Label htmlFor="subcategorie" className="text-base">
                  Subcategorie *
                </Label>
                <Select value={subcategorie} onValueChange={setSubcategorie}>
                  <SelectTrigger
                    id="subcategorie"
                    className={`h-12 ${errors.subcategorie ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Selecteer subcategorie..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategorieen.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subcategorie && (
                  <p className="text-sm text-red-600">{errors.subcategorie}</p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1 h-12">
                Annuleren
              </Button>
              <Button onClick={handleStep1Next} className="flex-1 h-12">
                Volgende
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Detail Form */}
        {step === 2 && (
          <div className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-base">
                Status
              </Label>
              <Select value={status} onValueChange={(v) => setStatus(v as WerfItem["status"])}>
                <SelectTrigger id="status" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uit te voeren">Uit te voeren</SelectItem>
                  <SelectItem value="in uitvoering">In uitvoering</SelectItem>
                  <SelectItem value="voltooid">Voltooid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adres" className="text-base">
                Adres/locatie
              </Label>
              <Input
                id="adres"
                placeholder="bv. Kerkstraat 45"
                value={adresLocatie}
                onChange={(e) => setAdresLocatie(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titel" className="text-base">
                Titel *
              </Label>
              <Input
                id="titel"
                placeholder="Korte beschrijving van het item"
                value={titel}
                onChange={(e) => setTitel(e.target.value)}
                className={`h-12 ${errors.titel ? "border-red-500" : ""}`}
              />
              {errors.titel && <p className="text-sm text-red-600">{errors.titel}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactpersoon" className="text-base">
                Contactpersoon
              </Label>
              <Input
                id="contactpersoon"
                placeholder="Naam"
                value={contactpersoon}
                onChange={(e) => setContactpersoon(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactgegevens" className="text-base">
                Contactgegevens
              </Label>
              <Textarea
                id="contactgegevens"
                placeholder="Email, telefoonnummer, etc."
                value={contactgegevens}
                onChange={(e) => setContactgegevens(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="opmerking" className="text-base">
                Opmerking
              </Label>
              <Textarea
                id="opmerking"
                placeholder="Gedetailleerde beschrijving, opmerkingen, acties..."
                value={opmerking}
                onChange={(e) => setOpmerking(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 size-5" />
                    {deadline ? (
                      format(deadline, "dd MMMM yyyy", { locale: nl })
                    ) : (
                      <span className="text-gray-500">Selecteer deadline...</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Prioriteit: {prioriteit}</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-8">Laag</span>
                <Slider
                  value={[prioriteit]}
                  onValueChange={(values) => setPrioriteit(values[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-8">Hoog</span>
              </div>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((p) => (
                  <Button
                    key={p}
                    variant={prioriteit === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPrioriteit(p)}
                    className="flex-1"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Bijlagen/foto's</Label>
              <Button variant="outline" className="w-full h-12" type="button">
                <Camera className="size-5 mr-2" />
                Foto toevoegen
              </Button>
              <p className="text-xs text-gray-500">
                In productie-app: camera/upload functionaliteit
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                Terug
              </Button>
              <Button onClick={handleStep2Save} className="flex-1 h-12">
                Opslaan
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}