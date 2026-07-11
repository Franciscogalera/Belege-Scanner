import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Beleg } from '../models/beleg.model';

@Injectable({ providedIn: 'root' })
export class ExtractService {
  private http = inject(HttpClient);

  extract(foto: string) {
    return this.http.post<Partial<Beleg>>('/api/extract', { foto });
  }
}
