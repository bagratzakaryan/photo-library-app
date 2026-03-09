import { Component, Signal, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { IPhoto } from '../core/photo';
import { Item } from './item/item';
import { PhotoService } from '../core/photo.service';

@Component({
  selector: 'xm-photos',
  imports: [MatButtonModule, MatIconModule, Item],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos {
  photos!: Signal<IPhoto[]>;
  loading = false;

  constructor(
    private readonly router: Router,
    private readonly photoService: PhotoService,
    private readonly cd: ChangeDetectorRef,
  ) {
    this.photos = this.photoService.photos;
  }

  onNavigateToDetail(photo: IPhoto): void {
    this.photoService.setSelectedPhoto(photo);
    this.router.navigateByUrl(`/photos/${photo.id}`);
  }

  onAddFavorite(photo: IPhoto): void {
    this.photoService.updatePhoto({ ...photo, favorite: true });
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
