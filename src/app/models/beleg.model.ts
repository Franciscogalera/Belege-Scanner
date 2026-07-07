export const KATEGORIEN = [
  'Fremdleistungen',
  'Werbekosten',
  'Software & Abos',
  'Arbeitsmittel / Hardware',
  'Telekommunikation',
  'Raumkosten',
  'Werbungskosten',
  'Gesundheit',
  'Sonderausgaben',
  'Sonstiges',
];

export interface Beleg {
  _id?: string;
  rechnungssteller: string;
  betrag: number;
  datum: string;
  mwst?: number;
  kategorie?: string;
  foto?: string;
  erstelltAm?: string;
}
