import { useState, useEffect } from "react";
import { SUBCATEGORIEEN } from "../../domain/categories.ts";
import type { WerfItem } from "../../domain/models.ts";
import { validateItemCategory, validateItemDetails } from "../../domain/itemValidation.ts";
import { toast } from "sonner";

type Step = 1 | 2;
interface FormOptions {
  isOpen: boolean;
  onClose: () => void;
  initialLocation: { lat: number; lng: number } | null;
}

export function useNewItemForm({ isOpen, onClose, initialLocation }: FormOptions) {
  const [step, setStep] = useState<Step>(1);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation
  );

  // Step 1 fields
  const [hoofdcategorie, setHoofdcategorie] = useState<string>("");
  const [subcategorie, setSubcategorie] = useState<string>("");

  // Step 2 fields
  const [status, setStatus] = useState<WerfItem["status"]>("uit te voeren");
  const [adresLocatie, setAdresLocatie] = useState("");
  const [titel, setTitel] = useState("");
  const [contactpersoon, setContactpersoon] = useState("");
  const [contactgegevens, setContactgegevens] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [prioriteit, setPrioriteit] = useState<number>(3);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get GPS location if not provided from map click
  useEffect(() => {
    let cancelled = false;
    if (isOpen && !gpsLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Silently ignore - geolocation may be disabled in iframe/embedded contexts
          // A location can still be supplied by selecting a point on the map.
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
    return () => { cancelled = true; };
  }, [isOpen, gpsLocation]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentDate(new Date());
      setStep(1);
      setHoofdcategorie("");
      setSubcategorie("");
      setStatus("uit te voeren");
      setAdresLocatie("");
      setTitel("");
      setContactpersoon("");
      setContactgegevens("");
      setOpmerking("");
      setDeadline(undefined);
      setPrioriteit(3);
      setErrors({});
      setGpsLocation(initialLocation);
    }
  }, [isOpen, initialLocation]);

  // Get available subcategories based on hoofdcategorie
  const availableSubcategorieen = hoofdcategorie ? SUBCATEGORIEEN[hoofdcategorie] || [] : [];
  const requiresSubcategorie = availableSubcategorieen.length > 0;

  const handleStep1Next = () => {
    const newErrors = validateItemCategory(hoofdcategorie, subcategorie);

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleStep2Save = () => {
    const newErrors = validateItemDetails(titel, gpsLocation);

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // In real app, save to backend here
      toast.success("Item opgeslagen", {
        description: `"${titel}" is succesvol toegevoegd`,
      });
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return {
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
  };
}
