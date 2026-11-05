import { SUBCATEGORIEEN } from "./categories.ts";

export function validateItemCategory(hoofdcategorie: string, subcategorie: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!Object.hasOwn(SUBCATEGORIEEN, hoofdcategorie)) {
    errors.hoofdcategorie = "Hoofdcategorie is verplicht";
  } else if (SUBCATEGORIEEN[hoofdcategorie].length && !SUBCATEGORIEEN[hoofdcategorie].includes(subcategorie)) {
    errors.subcategorie = "Subcategorie is verplicht";
  }
  return errors;
}

export function validateItemDetails(titel: string, location: { lat: number; lng: number } | null): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!titel.trim()) errors.titel = "Titel is verplicht";
  if (!location || !Number.isFinite(location.lat) || !Number.isFinite(location.lng) ||
    Math.abs(location.lat) > 90 || Math.abs(location.lng) > 180) {
    errors.gps = "GPS locatie is vereist";
  }
  return errors;
}
