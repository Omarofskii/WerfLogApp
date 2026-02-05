// Mock data voor SharePoint Lists structuur

export interface Project {
  projectId: string;
  projectName: string;
}

export interface WerfItem {
  itemId: string;
  projectId: string;
  datum: Date;
  latitude: number;
  longitude: number;
  hoofdcategorie: string;
  subcategorie: string;
  status: "uit te voeren" | "in uitvoering" | "voltooid";
  adresLocatie: string;
  titel: string;
  contactpersoon: string;
  contactgegevens: string;
  opmerking: string;
  deadline: Date;
  prioriteit: 1 | 2 | 3 | 4 | 5;
  attachments: string[];
}

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

export const mockProjects: Project[] = [
  { projectId: "1", projectName: "Heraanleg Kerkstraat - Fase 1" },
  { projectId: "2", projectName: "Rioleringssanering Stationsplein" },
  { projectId: "3", projectName: "Vernieuwing N8 - Zone Zuid" },
  { projectId: "4", projectName: "Woonwijk De Nieuwe Hoven" },
  { projectId: "5", projectName: "Industrieterrein Oost - Infrastructuur" },
];

export const mockWerfItems: WerfItem[] = [
  {
    itemId: "1",
    projectId: "1",
    datum: new Date("2026-01-20"),
    latitude: 51.0543,
    longitude: 3.7174,
    hoofdcategorie: "Riolering",
    subcategorie: "Huisaansluiting",
    status: "uit te voeren",
    adresLocatie: "Kerkstraat 45",
    titel: "Verzakking huisaansluiting nr. 45",
    contactpersoon: "De Smet Jan",
    contactgegevens: "jan.desmet@email.com\n0478 12 34 56",
    opmerking: "Verzakking geconstateerd ter hoogte van aansluiting. Mogelijk vorstschade. Te herstellen voor oplevering.",
    deadline: new Date("2026-02-01"),
    prioriteit: 4,
    attachments: [],
  },
  {
    itemId: "2",
    projectId: "1",
    datum: new Date("2026-01-25"),
    latitude: 51.0548,
    longitude: 3.7180,
    hoofdcategorie: "Bovenbouw",
    subcategorie: "Voetpad",
    status: "in uitvoering",
    adresLocatie: "Kerkstraat 72-76",
    titel: "Voetpad ongelijkmatig afgewerkt",
    contactpersoon: "Peeters Marie",
    contactgegevens: "0495 87 65 43",
    opmerking: "Hoogteverschillen tussen tegels > 5mm. Herleggen vereist.",
    deadline: new Date("2026-02-10"),
    prioriteit: 3,
    attachments: [],
  },
  {
    itemId: "3",
    projectId: "1",
    datum: new Date("2026-02-04"),
    latitude: 51.0552,
    longitude: 3.7168,
    hoofdcategorie: "Groen",
    subcategorie: "",
    status: "uit te voeren",
    adresLocatie: "Kerkstraat - groenzone hoek Stationsstraat",
    titel: "Beplanting beschadigd tijdens werken",
    contactpersoon: "Gemeentelijke groendienst",
    contactgegevens: "groen@gemeente.be",
    opmerking: "3 heesters en 1 boom beschadigd. Aanplanting vervangbomen voorzien.",
    deadline: new Date("2026-03-15"),
    prioriteit: 2,
    attachments: [],
  },
  {
    itemId: "4",
    projectId: "1",
    datum: new Date("2026-01-15"),
    latitude: 51.0545,
    longitude: 3.7172,
    hoofdcategorie: "Nutsvoorzieningen",
    subcategorie: "Fluvius",
    status: "voltooid",
    adresLocatie: "Kerkstraat 38",
    titel: "Elektriciteitskabel verkeerd gemoffeld",
    contactpersoon: "Fluvius - Van Damme",
    contactgegevens: "0498 76 54 32",
    opmerking: "Hersteld op 28/01. Controle uitgevoerd en goedgekeurd.",
    deadline: new Date("2026-01-30"),
    prioriteit: 5,
    attachments: [],
  },
  {
    itemId: "5",
    projectId: "1",
    datum: new Date("2026-02-02"),
    latitude: 51.0549,
    longitude: 3.7176,
    hoofdcategorie: "Privatief",
    subcategorie: "Handelaar",
    status: "uit te voeren",
    adresLocatie: "Kerkstraat 65 (Bakkerij)",
    titel: "Klacht toegang laad-/loszone",
    contactpersoon: "Bakkerij Van Acker",
    contactgegevens: "info@bakkerij-vanacker.be",
    opmerking: "Laad-/loszone tijdelijk geblokkeerd door materiaal. Doorgang vrijmaken en signalisatie aanpassen.",
    deadline: new Date("2026-01-30"),
    prioriteit: 4,
    attachments: [],
  },
];

// Helper functions
export function getProjectById(projectId: string): Project | undefined {
  return mockProjects.find((p) => p.projectId === projectId);
}

export function getItemsByProjectId(projectId: string): WerfItem[] {
  return mockWerfItems.filter((item) => item.projectId === projectId);
}

export function getOpenItemsCount(projectId: string): number {
  return mockWerfItems.filter(
    (item) => item.projectId === projectId && item.status !== "voltooid"
  ).length;
}

export function getOverdueItemsCount(projectId: string): number {
  const now = new Date();
  return mockWerfItems.filter(
    (item) =>
      item.projectId === projectId &&
      item.status !== "voltooid" &&
      item.deadline < now
  ).length;
}
