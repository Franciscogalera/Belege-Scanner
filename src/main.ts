import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .then(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('sw.js')
        .then((reg) => console.log('Service Worker registriert', reg))
        .catch((err) => console.error('Fehler bei der Registrierung:', err));
    }
  })
  .catch((err) => console.error(err));
