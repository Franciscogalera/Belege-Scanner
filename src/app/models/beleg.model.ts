export interface Beleg {
  _id?: string;
  rechnungssteller: string;
  betrag: number;
  datum: string;
  mwst?: number;
  foto?: string;
  erstelltAm?: string;
}
