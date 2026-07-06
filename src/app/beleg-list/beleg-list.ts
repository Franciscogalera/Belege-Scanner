import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BelegeService } from '../services/belege.service';

@Component({
  selector: 'app-beleg-list',
  imports: [RouterLink, DatePipe, MatToolbarModule, MatListModule, MatButtonModule, MatIconModule],
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
