import { Component, Input, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Item } from '../../photos/item/item';
import { IPhoto } from '../photo';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'xm-gallery',
  imports: [MatButtonModule, MatIconModule, Item],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  @Input() photos!: Signal<IPhoto[]>;
  @Input() isFavorite = false;

  constructor(
    private readonly router: Router,
    private readonly photoService: PhotoService,
  ) {}

  onNavigateToDetail(photo: IPhoto): void {
    this.photoService.setSelectedPhoto(photo);
    this.router.navigateByUrl(`/photos/${photo.id}`);
  }

  onAddFavorite(photo: IPhoto): void {
    this.photoService.updatePhoto({ ...photo, favorite: true });
  }
}
