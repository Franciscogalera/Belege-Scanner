import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly isOnline = signal(navigator.onLine);
  protected readonly updateVerfuegbar = signal(false);
  private wartenderWorker: ServiceWorker | null = null;

  constructor() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) {
          return;
        }
        reg.addEventListener('updatefound', () => {
          const neuerWorker = reg.installing;
          if (!neuerWorker) {
            return;
          }
          neuerWorker.addEventListener('statechange', () => {
            if (neuerWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.wartenderWorker = neuerWorker;
              this.updateVerfuegbar.set(true);
            }
          });
        });
      });

      let neugeladen = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (neugeladen) {
          return;
        }
        neugeladen = true;
        window.location.reload();
      });
    }
  }

  neuLaden() {
    this.wartenderWorker?.postMessage('SKIP_WAITING');
  }
}
