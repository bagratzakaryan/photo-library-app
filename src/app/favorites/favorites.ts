import { Component, Input, Signal, computed } from '@angular/core';
import { Router } from '@angular/router';

import { IPhoto } from '../core/photo';
import { PhotoService } from '../core/photo.service';
import { Gallery } from '../core/gallery/gallery';

@Component({
  selector: 'xm-favorites',
  imports: [Gallery],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  @Input() photos!: Signal<IPhoto[]>;

  constructor(
    private readonly router: Router,
    private readonly photoService: PhotoService,
  ) {
    this.photos = computed(() =>
      this.photoService.photos().filter((photo: IPhoto) => photo.favorite),
    );
  }

  onNavigateToDetail(photo: IPhoto): void {
    this.photoService.setSelectedPhoto(photo);
    this.router.navigateByUrl(`/photos/${photo.id}`);
  }
}
