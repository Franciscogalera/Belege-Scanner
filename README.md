# Belege-Scanner

Eine PWA zur Erfassung von Belegen für die Steuererklärung.

## Zweck

Als Vorarbeit für die Steuer muss man jedes Jahr alle Rechnungen durchgehen und in eine
Excel-Liste eintragen (Name, Betrag, Datum, MwSt, Kategorie). Das ist sehr zeitaufwendig.
Mit der App fotografiert man einen Beleg, erfasst die Daten und kann am Ende das
jeweilige Jahr als CSV-Datei exportieren. 

## PWA/Web-API
Die App lässt sich auf dem Desktop oder Mobilgerät installieren und ist teilweise auch offline nutzbar. 
Der Service Worker cashed dabei die App-Shell, so dass die App auch ohne Intenetverbindung startet und bereits geladene Belege sichtbar sind.
Der Kamerazugriff läuft über die Browser Web-API. Es wird ein Videostream angezeigt und daraus ein Foto generiert.

## Tech-Stack
Frontend: Angular & Angular Material
Backend: Node.js/ExpressJs
Datenbank: MongoDB

## Lokal starten

Voraussetzung: Node.js, MongoDB

Backend:

```bash
cd backend
npm install
node server_local.js
```

BE läuft dann auf http://localhost:4000.

Frontend:

```bash
npm install
ng serve
```

FE läuft auf http://localhost:4200. Die API-Aufrufe werden über `proxy.conf.json` an das
Backend auf Port 4000 weitergeleitet.

## Liveansicht

https://lyra.hs-emden-leer.de:20205/ (kein Login nötig)
