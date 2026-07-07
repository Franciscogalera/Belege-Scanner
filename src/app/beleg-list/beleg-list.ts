import {Component, inject, OnInit, ChangeDetectionStrategy, signal, computed} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BelegeService } from '../services/belege.service';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatDivider} from '@angular/material/list';

@Component({
  selector: 'app-beleg-list',
  imports: [RouterLink, DatePipe, MatToolbarModule, MatCardModule, MatButtonModule, MatFormField, MatLabel, MatSelect, MatOption, MatDivider],
  templateUrl: './beleg-list.html',
  styleUrl: './beleg-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BelegList implements OnInit {
  private service = inject(BelegeService);
  belege = this.service.belege;
  selectedYear = signal(String(new Date().getFullYear()));
  years = computed(() => {
    const jahre = new Set(this.belege().map(b => b.datum.slice(0, 4)));
    return Array.from(jahre).sort().reverse();
  });
  gefilterteBelege = computed(() =>
    this.belege()
      .filter(b => b.datum.slice(0, 4) === this.selectedYear())
      .sort((a, b) => a.datum < b.datum ? 1 : -1)
  );

  ngOnInit() {
    this.service.laden();
  }
}
