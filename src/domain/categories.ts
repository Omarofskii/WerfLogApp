export const HOOFDCATEGORIEEN = [
  "Riolering",
  "Bovenbouw",
  "Groen",
  "Nutsvoorzieningen",
  "Privatief",
  "Andere",
] as const;

export const SUBCATEGORIEEN: Record<string, string[]> = {
  Riolering: ["Riolering straat", "Huisaansluiting", "Straatkolken", "Toezichtput", "Andere"],
  Bovenbouw: ["Rijbaan", "Voetpad", "Fietspad", "Parkeerstrook", "Andere"],
  Groen: [],
  Nutsvoorzieningen: ["Fluvius", "Andere"],
  Privatief: ["Bewoner", "Handelaar"],
  Andere: [],
};

