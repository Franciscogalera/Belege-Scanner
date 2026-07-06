import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BelegeService } from '../services/belege.service';

@Component({
  selector: 'app-beleg-list',
  imports: [RouterLink, DatePipe, MatToolbarModule, MatCardModule, MatButtonModule],
  templateUrl: './beleg-list.html',
  styleUrl: './beleg-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BelegList implements OnInit {
  private service = inject(BelegeService);
  belege = this.service.belege;

  ngOnInit() {
    this.service.laden();
  }
}
