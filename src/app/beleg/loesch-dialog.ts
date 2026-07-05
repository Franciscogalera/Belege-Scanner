import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-loesch-dialog',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Beleg löschen?</h2>
    <mat-dialog-content>„{{ data.name }}" wird dauerhaft entfernt.</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>Abbrechen</button>
      <button matButton="filled" [mat-dialog-close]="true">Löschen</button>
    </mat-dialog-actions>
  `,
})
export class LoeschDialog {
  data: { name: string } = inject(MAT_DIALOG_DATA);
}
