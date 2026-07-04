import {
  Component,
  inject,
  ChangeDetectionStrategy,
  viewChild,
  ElementRef,
  signal,
  afterNextRender,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BelegeService } from '../services/belege.service';

@Component({
  selector: 'app-beleg-form',
  imports: [ReactiveFormsModule, RouterLink, MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './beleg-form.html',
  styleUrl: './beleg-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BelegForm {
  private fb = inject(FormBuilder);
  private service = inject(BelegeService);
  private router = inject(Router);

  private video = viewChild<ElementRef<HTMLVideoElement>>('video');
  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private stream: MediaStream | null = null;

  foto = signal<string | null>(null);
  zeigeFormular = signal(false);

  form = this.fb.nonNullable.group({
    rechnungssteller: ['', Validators.required],
    betrag: [0, [Validators.required, Validators.min(0)]],
    datum: ['', Validators.required],
    mwst: [19],
  });

  constructor() {
    afterNextRender(() => this.kameraStarten());
  }

  private async kameraStarten() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = this.video();
      if (video) {
        video.nativeElement.srcObject = this.stream;
      }
    } catch {
      this.zeigeFormular.set(true);
    }
  }

  fotoAufnehmen() {
    const video = this.video()?.nativeElement;
    const canvas = this.canvas()?.nativeElement;
    if (!video || !canvas) {
      return;
    }
    const maxBreite = 1000;
    const skala = Math.min(1, maxBreite / video.videoWidth);
    canvas.width = video.videoWidth * skala;
    canvas.height = video.videoHeight * skala;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.foto.set(canvas.toDataURL('image/jpeg', 0.7));
    this.kameraStoppen();
    this.zeigeFormular.set(true);
  }

  private kameraStoppen() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
  }

  speichern() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const beleg = { ...this.form.getRawValue(), foto: this.foto() ?? undefined };
    this.service.anlegen(beleg).subscribe(() => {
      this.service.laden();
      this.router.navigate(['/']);
    });
  }
}
