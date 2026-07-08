import {Component, inject, ChangeDetectionStrategy, signal, input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {Kamera} from '../kamera/kamera';
import {BelegeService} from '../services/belege.service';
import {KATEGORIEN} from '../models/beleg.model';
import {MatDialog} from '@angular/material/dialog';
import {LoeschDialog} from './loesch-dialog';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-beleg',
  imports: [ReactiveFormsModule, RouterLink, MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, Kamera, MatIcon, MatSelect, MatOption],
  templateUrl: './beleg.html',
  styleUrl: './beleg.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Beleg implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(BelegeService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  id = input<string>();

  foto = signal<string | null>(null);
  zeigeFormular = signal(false);

  minDatum = '2020-01-01';
  maxDatum = new Date().toISOString().slice(0, 10);

  kategorien = KATEGORIEN;

  form = this.fb.nonNullable.group({
    rechnungssteller: ['', Validators.required],
    betrag: [0, [Validators.required, Validators.min(0)]],
    datum: ['', Validators.required],
    mwst: [19],
    kategorie: ['Sonstiges'],
  });

  ngOnInit() {
    const id = this.id();
    if (id) {
      this.zeigeFormular.set(true);
      this.service.getBeleg(id).subscribe(beleg => {
        this.form.patchValue(beleg);
        this.foto.set(beleg.foto ?? null);
      });
    }
  }

  fotoGesetzt(dataUrl: string) {
    this.foto.set(dataUrl);
    this.zeigeFormular.set(true);
  }

  weiterOhneFoto() {
    this.zeigeFormular.set(true);
  }

  speichern() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const beleg = {...this.form.getRawValue(), foto: this.foto() ?? undefined};
    const id = this.id();
    const anfrage = id ? this.service.editBeleg(id, beleg) : this.service.addBeleg(beleg);
    anfrage.subscribe({
      next: () => {
        this.service.loadBelege();
        this.snackBar.open('Beleg gespeichert', undefined, { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBar.open('Speichern fehlgeschlagen', undefined, {
          duration: 4000,
          panelClass: 'snackbar-error',
        });
      },
    });
  }
  loeschen() {
    const id = this.id();
    if (!id) {
      return;
    }
    const ref = this.dialog.open(LoeschDialog, {
      data: { name: this.form.value.rechnungssteller },
    });
    ref.afterClosed().subscribe(bestaetigt => {
      if (bestaetigt) {
        this.service.deleteBeleg(id).subscribe({
          next: () => {
            this.service.loadBelege();
            this.snackBar.open('Beleg gelöscht', undefined, { duration: 3000 });
            this.router.navigate(['/']);
          },
          error: () => {
            this.snackBar.open('Löschen fehlgeschlagen', undefined, {
              duration: 4000,
              panelClass: 'snackbar-error',
            });
          },
        });
      }
    });
  }
}
