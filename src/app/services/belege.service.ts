import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Beleg } from '../models/beleg.model';

@Injectable({ providedIn: 'root' })
export class BelegeService {
  private http = inject(HttpClient);
  private url = '/api/belege';

  belege = signal<Beleg[]>([]);

  laden() {
    this.http.get<Beleg[]>(this.url).subscribe(daten => this.belege.set(daten));
  }

  anlegen(beleg: Beleg) {
    return this.http.post<Beleg>(this.url, beleg);
  }

  aendern(id: string, beleg: Beleg) {
    return this.http.put<Beleg>(`${this.url}/${id}`, beleg);
  }

  loeschen(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getBeleg(id: string){
    return this.http.get<Beleg>(`${this.url}/${id}`)
  }
}
