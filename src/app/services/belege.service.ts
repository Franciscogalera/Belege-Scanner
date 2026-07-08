import {Injectable, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Beleg} from '../models/beleg.model';

@Injectable({providedIn: 'root'})
export class BelegeService {
  private http = inject(HttpClient);
  private url = '/api/belege';

  belege = signal<Beleg[]>([]);
  ladeFehler = signal(false);

  loadBelege() {
    this.http.get<Beleg[]>(this.url).subscribe({
      next: daten => {
        this.belege.set(daten);
        this.ladeFehler.set(false);
      },
      error: () => this.ladeFehler.set(true),
    });
  }

  addBeleg(beleg: Beleg) {
    return this.http.post<Beleg>(this.url, beleg);
  }

  editBeleg(id: string, beleg: Beleg) {
    return this.http.put<Beleg>(`${this.url}/${id}`, beleg);
  }

  deleteBeleg(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getBeleg(id: string) {
    return this.http.get<Beleg>(`${this.url}/${id}`)
  }
}
