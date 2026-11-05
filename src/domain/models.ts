export interface Project {
  readonly projectId: string;
  readonly projectName: string;
}

export interface WerfItem {
  readonly itemId: string;
  readonly projectId: string;
  readonly datum: Date;
  readonly latitude: number;
  readonly longitude: number;
  readonly hoofdcategorie: string;
  readonly subcategorie: string;
  readonly status: "uit te voeren" | "in uitvoering" | "voltooid";
  readonly adresLocatie: string;
  readonly titel: string;
  readonly contactpersoon: string;
  readonly contactgegevens: string;
  readonly opmerking: string;
  readonly deadline: Date;
  readonly prioriteit: 1 | 2 | 3 | 4 | 5;
  readonly attachments: readonly string[];
}

