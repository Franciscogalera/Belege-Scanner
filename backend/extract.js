const { GoogleGenerativeAI } = require('@google/generative-ai');

const KATEGORIEN = [
  'Fremdleistungen', 'Werbekosten', 'Software & Abos', 'Arbeitsmittel / Hardware',
  'Telekommunikation', 'Raumkosten', 'Werbungskosten', 'Gesundheit', 'Sonderausgaben', 'Sonstiges',
];

const PROMPT = `Du bekommst das Foto eines Belegs oder einer Rechnung.
Lies die Daten aus und gib NUR ein JSON-Objekt mit genau diesen Feldern zurück:
"rechnungssteller": Name des Rechnungsstellers (String)
"betrag": Gesamtbetrag als Zahl mit Punkt als Dezimaltrenner (z.B. 45.70)
"datum": Datum im Format JJJJ-MM-TT
"mwst": Mehrwertsteuersatz in Prozent als Zahl (z.B. 19); wenn nicht erkennbar 19
"kategorie": genau einer dieser Werte, der am besten passt: ${KATEGORIEN.join(', ')}. Wenn unklar: "Sonstiges".
Wenn ein Feld nicht lesbar ist, nimm einen sinnvollen Default (leerer String bzw. 0).`;

function register(app) {
  app.post('/api/extract', async (req, res) => {
    try {
      const { foto } = req.body;
      if (!foto) {
        return res.status(400).json({ error: 'Kein Foto übermittelt' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY nicht gesetzt' });
      }

      const base64 = foto.replace(/^data:image\/jpeg;base64,/, '');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const result = await model.generateContent([
        { text: PROMPT },
        { inlineData: { data: base64, mimeType: 'image/jpeg' } },
      ]);

      const daten = JSON.parse(result.response.text());
      res.json(daten);
    } catch (err) {
      res.status(500).json({ error: 'Auslesen fehlgeschlagen' });
    }
  });
}

module.exports = { register };
