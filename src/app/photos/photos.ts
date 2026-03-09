import { Component, Signal, HostListener, ChangeDetectorRef } from '@angular/core';

import { IPhoto } from '../core/photo';
import { PhotoService } from '../core/photo.service';
import { Gallery } from '../core/gallery/gallery';

@Component({
  selector: 'xm-photos',
  imports: [Gallery],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos {
  photos!: Signal<IPhoto[]>;
  loading = false;

  constructor(
    private readonly photoService: PhotoService,
    private readonly cd: ChangeDetectorRef,
  ) {
    this.photos = this.photoService.photos;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const threshold = 100; // pixels from bottom to trigger
    const height = document.documentElement.scrollHeight;

    if (scrollPosition > height - threshold) {
      this.loadPhotos();
    }
  }

  private loadPhotos(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.photoService.loadPhotos$().subscribe(() => {
      this.loading = false;
      this.cd.detectChanges();
    });
  }
}
