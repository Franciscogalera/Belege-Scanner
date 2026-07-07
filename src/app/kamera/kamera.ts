import {
  Component,
  ChangeDetectionStrategy,
  viewChild,
  ElementRef,
  output,
  afterNextRender,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kamera',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './kamera.html',
  styleUrl: './kamera.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Kamera implements OnDestroy {
  fotoAufgenommen = output<string>();
  abgebrochen = output<void>();

  private video = viewChild<ElementRef<HTMLVideoElement>>('video');
  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private stream: MediaStream | null = null;

  constructor() {
    afterNextRender(() => this.starten());
  }

  private async starten() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = this.video();
      if (video) {
        video.nativeElement.srcObject = this.stream;
      }
    } catch {
      this.abgebrochen.emit();
    }
  }

  aufnehmen() {
    const video = this.video()?.nativeElement;
    const canvas = this.canvas()?.nativeElement;
    if (!video || !canvas) {
      return;
    }

    const skala = Math.min(1, 1000 / video.videoWidth);
    canvas.width = video.videoWidth * skala;
    canvas.height = video.videoHeight * skala;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    this.stoppen();
    this.fotoAufgenommen.emit(dataUrl);
  }

  private stoppen() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
  }

  ngOnDestroy() {
    this.stoppen();
  }
}
